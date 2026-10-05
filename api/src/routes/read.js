import {
  ensureProgress,
  formatWallet,
  getAccount,
  getWalletRow,
} from "../lib/db.js";
import { json, parseMetadata } from "../lib/http.js";

export async function getWallet(env, accountId) {
  const account = await getAccount(env, accountId);
  if (!account) return json({ error: "ACCOUNT_NOT_FOUND" }, 404);

  const wallet = await getWalletRow(env, accountId);
  if (!wallet) return json({ error: "WALLET_NOT_FOUND" }, 404);

  return json({
    account: {
      id: account.id,
      status: account.status,
      createdAt: account.created_at,
    },
    wallet: formatWallet(wallet),
  });
}

export async function getProgress(env, accountId) {
  const account = await getAccount(env, accountId);
  if (!account) return json({ error: "ACCOUNT_NOT_FOUND" }, 404);

  await ensureProgress(env, accountId);

  const progress = await env.DB.prepare(`
    SELECT onboarding_step, phone_owned, tutorial_completed, updated_at
    FROM player_progress
    WHERE account_id = ?
  `).bind(accountId).first();

  return json({
    accountId,
    onboardingStep: progress.onboarding_step,
    phoneOwned: Boolean(progress.phone_owned),
    tutorialCompleted: Boolean(progress.tutorial_completed),
    updatedAt: progress.updated_at,
  });
}

export async function getInventory(env, accountId) {
  const account = await getAccount(env, accountId);
  if (!account) return json({ error: "ACCOUNT_NOT_FOUND" }, 404);

  const result = await env.DB.prepare(`
    SELECT
      inventory.id,
      inventory.item_id,
      inventory.acquired_at,
      inventory.metadata,
      catalog_items.type,
      catalog_items.name,
      catalog_items.price_rub
    FROM inventory
    JOIN catalog_items ON catalog_items.id = inventory.item_id
    WHERE inventory.account_id = ?
    ORDER BY inventory.acquired_at DESC
  `).bind(accountId).all();

  return json({
    accountId,
    count: result.results.length,
    items: result.results.map((item) => ({
      inventoryId: item.id,
      itemId: item.item_id,
      type: item.type,
      name: item.name,
      originalPriceRub: item.price_rub,
      acquiredAt: item.acquired_at,
      metadata: parseMetadata(item.metadata),
    })),
  });
}

export async function getLedger(env, accountId) {
  const account = await getAccount(env, accountId);
  if (!account) return json({ error: "ACCOUNT_NOT_FOUND" }, 404);

  const result = await env.DB.prepare(`
    SELECT
      id,
      type,
      currency,
      amount,
      balance_class,
      status,
      reference_id,
      metadata,
      created_at
    FROM ledger_entries
    WHERE account_id = ?
    ORDER BY created_at DESC
    LIMIT 100
  `).bind(accountId).all();

  return json({
    accountId,
    count: result.results.length,
    entries: result.results.map((entry) => ({
      id: entry.id,
      type: entry.type,
      currency: entry.currency,
      amount: entry.amount,
      balanceClass: entry.balance_class,
      status: entry.status,
      referenceId: entry.reference_id,
      metadata: parseMetadata(entry.metadata),
      createdAt: entry.created_at,
    })),
  });
}
