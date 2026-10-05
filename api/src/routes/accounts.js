import { STARTER_RUB } from "../config.js";
import { json } from "../lib/http.js";

export async function createAccount(env) {
  const accountId = crypto.randomUUID();
  const ledgerId = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO accounts (id, status, created_at)
      VALUES (?, 'FREE', ?)
    `).bind(accountId, now),
    env.DB.prepare(`
      INSERT INTO wallets (
        account_id,
        sol_available,
        sol_locked,
        rub_withdrawable,
        rub_non_withdrawable,
        rub_locked
      )
      VALUES (?, 0, 0, 0, ?, 0)
    `).bind(accountId, STARTER_RUB),
    env.DB.prepare(`
      INSERT INTO player_progress (
        account_id,
        onboarding_step,
        phone_owned,
        tutorial_completed,
        updated_at
      )
      VALUES (?, 'MEET_GUIDE', 0, 0, ?)
    `).bind(accountId, now),
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
      VALUES (?, ?, 'STARTER_GRANT', 'RUB', ?, 'NON_WITHDRAWABLE', 'COMPLETED', NULL, ?, ?)
    `).bind(
      ledgerId,
      accountId,
      STARTER_RUB,
      JSON.stringify({ source: "ACCOUNT_CREATION" }),
      now,
    ),
  ]);

  return json(
    {
      ok: true,
      account: {
        id: accountId,
        status: "FREE",
        createdAt: now,
      },
      progress: {
        onboardingStep: "MEET_GUIDE",
        phoneOwned: false,
        tutorialCompleted: false,
      },
      wallet: {
        solAvailable: 0,
        solLocked: 0,
        rubWithdrawable: 0,
        rubNonWithdrawable: STARTER_RUB,
        rubLocked: 0,
        rubTotal: STARTER_RUB,
      },
    },
    201,
  );
}
