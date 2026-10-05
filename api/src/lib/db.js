export async function getAccount(env, accountId) {
  return env.DB.prepare(`
    SELECT id, status, created_at
    FROM accounts
    WHERE id = ?
  `).bind(accountId).first();
}

export async function getWalletRow(env, accountId) {
  return env.DB.prepare(`
    SELECT
      sol_available,
      sol_locked,
      rub_withdrawable,
      rub_non_withdrawable,
      rub_locked
    FROM wallets
    WHERE account_id = ?
  `).bind(accountId).first();
}

export function formatWallet(wallet) {
  const rubWithdrawable = Number(wallet?.rub_withdrawable || 0);
  const rubNonWithdrawable = Number(wallet?.rub_non_withdrawable || 0);
  const rubLocked = Number(wallet?.rub_locked || 0);

  return {
    solAvailable: Number(wallet?.sol_available || 0),
    solLocked: Number(wallet?.sol_locked || 0),
    rubWithdrawable,
    rubNonWithdrawable,
    rubLocked,
    rubTotal: rubWithdrawable + rubNonWithdrawable + rubLocked,
  };
}

export async function ensureProgress(env, accountId) {
  const existing = await env.DB.prepare(`
    SELECT account_id
    FROM player_progress
    WHERE account_id = ?
  `).bind(accountId).first();

  if (existing) return;

  const now = new Date().toISOString();

  await env.DB.prepare(`
    INSERT INTO player_progress (
      account_id,
      onboarding_step,
      phone_owned,
      tutorial_completed,
      updated_at
    )
    VALUES (?, 'MEET_GUIDE', 0, 0, ?)
  `).bind(accountId, now).run();
}
