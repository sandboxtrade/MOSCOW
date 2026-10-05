import { STARTER_PHONE_ID, TEST_SOL_TO_RUBG } from "../config.js";
import {
  ensureProgress,
  formatWallet,
  getAccount,
  getWalletRow,
} from "../lib/db.js";
import { normalizeSolAmount } from "../lib/http.js";
import {
  completeTransaction,
  failTransaction,
} from "../lib/transactions.js";

export async function buyItem(env, transaction, itemId) {
  if (!itemId) {
    return failTransaction(env, transaction, 400, "ITEM_ID_REQUIRED");
  }

  const item = await env.DB.prepare(`
    SELECT id, type, name, price_rub, enabled
    FROM catalog_items
    WHERE id = ?
  `).bind(itemId).first();

  if (!item) return failTransaction(env, transaction, 404, "ITEM_NOT_FOUND");
  if (Number(item.enabled) !== 1) {
    return failTransaction(env, transaction, 409, "ITEM_DISABLED");
  }

  await ensureProgress(env, transaction.accountId);

  const owned = await env.DB.prepare(`
    SELECT id
    FROM inventory
    WHERE account_id = ? AND item_id = ?
    LIMIT 1
  `).bind(transaction.accountId, itemId).first();

  if (owned) {
    return failTransaction(env, transaction, 409, "ITEM_ALREADY_OWNED");
  }

  const wallet = await getWalletRow(env, transaction.accountId);
  if (!wallet) return failTransaction(env, transaction, 404, "WALLET_NOT_FOUND");

  const price = Number(item.price_rub);

  if (itemId !== STARTER_PHONE_ID) {
    return failTransaction(env, transaction, 409, "PAYMENT_POLICY_NOT_DEFINED");
  }

  if (Number(wallet.rub_non_withdrawable) < price) {
    return failTransaction(
      env,
      transaction,
      409,
      "INSUFFICIENT_NON_WITHDRAWABLE_RUB",
      {
        available: Number(wallet.rub_non_withdrawable),
        required: price,
      },
    );
  }

  const inventoryId = crypto.randomUUID();
  const purchaseId = crypto.randomUUID();
  const ledgerId = crypto.randomUUID();
  const now = new Date().toISOString();
  const walletAfter = {
    ...wallet,
    rub_non_withdrawable: Number(wallet.rub_non_withdrawable) - price,
  };

  const response = {
    ok: true,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    purchase: {
      id: purchaseId,
      item: {
        id: item.id,
        type: item.type,
        name: item.name,
      },
      priceRub: price,
      balanceClass: "NON_WITHDRAWABLE",
    },
    progress: {
      onboardingStep: "PHONE_PURCHASED",
      phoneOwned: true,
    },
    wallet: formatWallet(walletAfter),
  };

  return completeTransaction(env, transaction, response, [
    env.DB.prepare(`
      UPDATE wallets
      SET rub_non_withdrawable = rub_non_withdrawable - ?
      WHERE account_id = ?
    `).bind(price, transaction.accountId),
    env.DB.prepare(`
      INSERT INTO inventory (id, account_id, item_id, acquired_at, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      inventoryId,
      transaction.accountId,
      item.id,
      now,
      JSON.stringify({ source: "SHOP_PURCHASE" }),
    ),
    env.DB.prepare(`
      INSERT INTO purchases (
        id,
        account_id,
        item_id,
        price_rub,
        balance_class,
        transaction_id,
        created_at
      )
      VALUES (?, ?, ?, ?, 'NON_WITHDRAWABLE', ?, ?)
    `).bind(
      purchaseId,
      transaction.accountId,
      item.id,
      price,
      transaction.id,
      now,
    ),
    env.DB.prepare(`
      UPDATE player_progress
      SET phone_owned = 1, onboarding_step = 'PHONE_PURCHASED', updated_at = ?
      WHERE account_id = ?
    `).bind(now, transaction.accountId),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id,
        account_id,
        type,
        currency,
        amount,
        balance_class,
        status,
        reference_id,
        metadata,
        created_at
      )
      VALUES (?, ?, 'SHOP_PURCHASE', 'RUB', ?, 'NON_WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      ledgerId,
      transaction.accountId,
      -price,
      transaction.referenceId,
      JSON.stringify({ itemId: item.id, itemName: item.name }),
      now,
    ),
  ]);
}

export async function depositTestSol(env, transaction, rawAmount) {
  const amount = normalizeSolAmount(rawAmount);

  if (amount === null || amount > 1000) {
    return failTransaction(
      env,
      transaction,
      400,
      amount === null ? "INVALID_AMOUNT" : "TEST_DEPOSIT_LIMIT_EXCEEDED",
    );
  }

  const wallet = await getWalletRow(env, transaction.accountId);
  if (!wallet) return failTransaction(env, transaction, 404, "WALLET_NOT_FOUND");

  const ledgerId = crypto.randomUUID();
  const now = new Date().toISOString();
  const walletAfter = {
    ...wallet,
    sol_available: Number(wallet.sol_available) + amount,
  };

  const response = {
    ok: true,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    status: "FUNDED",
    deposited: { currency: "TEST_SOL", amount },
    wallet: formatWallet(walletAfter),
  };

  return completeTransaction(env, transaction, response, [
    env.DB.prepare(`
      UPDATE wallets
      SET sol_available = sol_available + ?
      WHERE account_id = ?
    `).bind(amount, transaction.accountId),
    env.DB.prepare(`
      UPDATE accounts
      SET status = 'FUNDED'
      WHERE id = ?
    `).bind(transaction.accountId),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id,
        account_id,
        type,
        currency,
        amount,
        balance_class,
        status,
        reference_id,
        metadata,
        created_at
      )
      VALUES (?, ?, 'TEST_SOL_DEPOSIT', 'SOL', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      ledgerId,
      transaction.accountId,
      amount,
      transaction.referenceId,
      JSON.stringify({ testMode: true }),
      now,
    ),
  ]);
}

export async function withdrawTestSol(env, transaction, rawAmount) {
  const amount = normalizeSolAmount(rawAmount);
  if (amount === null) return failTransaction(env, transaction, 400, "INVALID_AMOUNT");

  const account = await getAccount(env, transaction.accountId);
  if (!account || account.status !== "FUNDED") {
    return failTransaction(env, transaction, 403, "FUNDED_ACCOUNT_REQUIRED");
  }

  const wallet = await getWalletRow(env, transaction.accountId);
  if (!wallet || Number(wallet.sol_available) < amount) {
    return failTransaction(env, transaction, 409, "INSUFFICIENT_SOL");
  }

  const ledgerId = crypto.randomUUID();
  const now = new Date().toISOString();
  const walletAfter = {
    ...wallet,
    sol_available: Number(wallet.sol_available) - amount,
  };

  const response = {
    ok: true,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    withdrawal: {
      currency: "TEST_SOL",
      amount,
      status: "COMPLETED",
    },
    wallet: formatWallet(walletAfter),
  };

  return completeTransaction(env, transaction, response, [
    env.DB.prepare(`
      UPDATE wallets
      SET sol_available = sol_available - ?
      WHERE account_id = ?
    `).bind(amount, transaction.accountId),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id,
        account_id,
        type,
        currency,
        amount,
        balance_class,
        status,
        reference_id,
        metadata,
        created_at
      )
      VALUES (?, ?, 'TEST_SOL_WITHDRAWAL', 'SOL', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      ledgerId,
      transaction.accountId,
      -amount,
      transaction.referenceId,
      JSON.stringify({ testMode: true }),
      now,
    ),
  ]);
}

export async function exchangeSolToRub(env, transaction, rawAmount) {
  const amountSol = normalizeSolAmount(rawAmount);
  if (amountSol === null) return failTransaction(env, transaction, 400, "INVALID_AMOUNT");

  const account = await getAccount(env, transaction.accountId);
  if (!account || account.status !== "FUNDED") {
    return failTransaction(env, transaction, 403, "FUNDED_ACCOUNT_REQUIRED");
  }

  const wallet = await getWalletRow(env, transaction.accountId);
  if (!wallet || Number(wallet.sol_available) < amountSol) {
    return failTransaction(env, transaction, 409, "INSUFFICIENT_SOL");
  }

  const rubAmount = Math.floor(amountSol * TEST_SOL_TO_RUBG);
  if (rubAmount <= 0) {
    return failTransaction(env, transaction, 400, "EXCHANGE_AMOUNT_TOO_SMALL");
  }

  const solLedgerId = crypto.randomUUID();
  const rubLedgerId = crypto.randomUUID();
  const now = new Date().toISOString();
  const walletAfter = {
    ...wallet,
    sol_available: Number(wallet.sol_available) - amountSol,
    rub_withdrawable: Number(wallet.rub_withdrawable) + rubAmount,
  };

  const response = {
    ok: true,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    exchange: {
      from: { currency: "TEST_SOL", amount: amountSol },
      to: {
        currency: "RUB",
        amount: rubAmount,
        balanceClass: "WITHDRAWABLE",
      },
      rate: { solToRubG: TEST_SOL_TO_RUBG },
    },
    wallet: formatWallet(walletAfter),
  };

  return completeTransaction(env, transaction, response, [
    env.DB.prepare(`
      UPDATE wallets
      SET sol_available = sol_available - ?, rub_withdrawable = rub_withdrawable + ?
      WHERE account_id = ?
    `).bind(amountSol, rubAmount, transaction.accountId),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id, account_id, type, currency, amount, balance_class,
        status, reference_id, metadata, created_at
      )
      VALUES (?, ?, 'SOL_TO_RUB', 'SOL', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      solLedgerId,
      transaction.accountId,
      -amountSol,
      transaction.referenceId,
      JSON.stringify({ testMode: true, side: "DEBIT", rate: TEST_SOL_TO_RUBG }),
      now,
    ),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id, account_id, type, currency, amount, balance_class,
        status, reference_id, metadata, created_at
      )
      VALUES (?, ?, 'SOL_TO_RUB', 'RUB', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      rubLedgerId,
      transaction.accountId,
      rubAmount,
      transaction.referenceId,
      JSON.stringify({ testMode: true, side: "CREDIT", rate: TEST_SOL_TO_RUBG }),
      now,
    ),
  ]);
}

export async function exchangeRubToSol(env, transaction, rawAmount) {
  const rubAmount = Math.floor(Number(rawAmount));
  if (!Number.isFinite(rubAmount) || rubAmount <= 0) {
    return failTransaction(env, transaction, 400, "INVALID_AMOUNT");
  }

  const account = await getAccount(env, transaction.accountId);
  if (!account || account.status !== "FUNDED") {
    return failTransaction(env, transaction, 403, "FUNDED_ACCOUNT_REQUIRED");
  }

  const wallet = await getWalletRow(env, transaction.accountId);
  if (!wallet || Number(wallet.rub_withdrawable) < rubAmount) {
    return failTransaction(env, transaction, 409, "INSUFFICIENT_WITHDRAWABLE_RUB");
  }

  const solAmount = Math.floor((rubAmount / TEST_SOL_TO_RUBG) * 1e9) / 1e9;
  if (solAmount <= 0) {
    return failTransaction(env, transaction, 400, "EXCHANGE_AMOUNT_TOO_SMALL");
  }

  const rubLedgerId = crypto.randomUUID();
  const solLedgerId = crypto.randomUUID();
  const now = new Date().toISOString();
  const walletAfter = {
    ...wallet,
    rub_withdrawable: Number(wallet.rub_withdrawable) - rubAmount,
    sol_available: Number(wallet.sol_available) + solAmount,
  };

  const response = {
    ok: true,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    exchange: {
      from: {
        currency: "RUB",
        amount: rubAmount,
        balanceClass: "WITHDRAWABLE",
      },
      to: { currency: "TEST_SOL", amount: solAmount },
      rate: { solToRubG: TEST_SOL_TO_RUBG },
    },
    wallet: formatWallet(walletAfter),
  };

  return completeTransaction(env, transaction, response, [
    env.DB.prepare(`
      UPDATE wallets
      SET rub_withdrawable = rub_withdrawable - ?, sol_available = sol_available + ?
      WHERE account_id = ?
    `).bind(rubAmount, solAmount, transaction.accountId),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id, account_id, type, currency, amount, balance_class,
        status, reference_id, metadata, created_at
      )
      VALUES (?, ?, 'RUB_TO_SOL', 'RUB', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      rubLedgerId,
      transaction.accountId,
      -rubAmount,
      transaction.referenceId,
      JSON.stringify({ testMode: true, side: "DEBIT", rate: TEST_SOL_TO_RUBG }),
      now,
    ),
    env.DB.prepare(`
      INSERT INTO ledger_entries (
        id, account_id, type, currency, amount, balance_class,
        status, reference_id, metadata, created_at
      )
      VALUES (?, ?, 'RUB_TO_SOL', 'SOL', ?, 'WITHDRAWABLE', 'COMPLETED', ?, ?, ?)
    `).bind(
      solLedgerId,
      transaction.accountId,
      solAmount,
      transaction.referenceId,
      JSON.stringify({ testMode: true, side: "CREDIT", rate: TEST_SOL_TO_RUBG }),
      now,
    ),
  ]);
}
