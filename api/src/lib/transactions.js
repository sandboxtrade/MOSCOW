import { json } from "./http.js";

export async function runIdempotent(env, options) {
  const {
    accountId,
    endpoint,
    type,
    clientKey,
    payload,
    execute,
  } = options;

  const idempotencyKey = `${accountId}:${endpoint}:${clientKey}`;

  const existing = await env.DB.prepare(`
    SELECT status, response_status, response_body, transaction_id
    FROM idempotency_keys
    WHERE key = ?
  `).bind(idempotencyKey).first();

  if (existing) {
    if (existing.status === "COMPLETED" || existing.status === "FAILED") {
      let body = {};
      try {
        body = JSON.parse(existing.response_body || "{}");
      } catch {}

      return json(
        { ...body, idempotentReplay: true },
        Number(existing.response_status || 200),
      );
    }

    return json(
      {
        error: "REQUEST_ALREADY_PROCESSING",
        transactionId: existing.transaction_id,
      },
      409,
    );
  }

  const transactionId = crypto.randomUUID();
  const referenceId = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO transactions (
        id,
        account_id,
        type,
        status,
        idempotency_key,
        reference_id,
        request_payload,
        result_payload,
        error_code,
        created_at,
        completed_at
      )
      VALUES (?, ?, ?, 'PENDING', ?, ?, ?, NULL, NULL, ?, NULL)
    `).bind(
      transactionId,
      accountId,
      type,
      idempotencyKey,
      referenceId,
      JSON.stringify(payload),
      now,
    ),
    env.DB.prepare(`
      INSERT INTO idempotency_keys (
        key,
        account_id,
        endpoint,
        status,
        response_status,
        response_body,
        transaction_id,
        created_at,
        completed_at
      )
      VALUES (?, ?, ?, 'PROCESSING', NULL, NULL, ?, ?, NULL)
    `).bind(idempotencyKey, accountId, endpoint, transactionId, now),
  ]);

  const transaction = {
    id: transactionId,
    accountId,
    referenceId,
    idempotencyKey,
  };

  try {
    return await execute(transaction);
  } catch (error) {
    return failTransaction(env, transaction, 500, "TRANSACTION_EXECUTION_FAILED", {
      message: error?.message || "Unknown error",
    });
  }
}

export async function completeTransaction(env, transaction, response, statements) {
  const now = new Date().toISOString();

  await env.DB.batch([
    ...statements,
    env.DB.prepare(`
      UPDATE transactions
      SET status = 'COMPLETED', result_payload = ?, completed_at = ?
      WHERE id = ?
    `).bind(JSON.stringify(response), now, transaction.id),
    env.DB.prepare(`
      UPDATE idempotency_keys
      SET status = 'COMPLETED', response_status = 200, response_body = ?, completed_at = ?
      WHERE key = ?
    `).bind(JSON.stringify(response), now, transaction.idempotencyKey),
  ]);

  return json(response);
}

export async function failTransaction(
  env,
  transaction,
  httpStatus,
  errorCode,
  extra = {},
) {
  const response = {
    ok: false,
    error: errorCode,
    transactionId: transaction.id,
    referenceId: transaction.referenceId,
    ...extra,
  };
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare(`
      UPDATE transactions
      SET status = 'FAILED', result_payload = ?, error_code = ?, completed_at = ?
      WHERE id = ?
    `).bind(JSON.stringify(response), errorCode, now, transaction.id),
    env.DB.prepare(`
      UPDATE idempotency_keys
      SET status = 'FAILED', response_status = ?, response_body = ?, completed_at = ?
      WHERE key = ?
    `).bind(httpStatus, JSON.stringify(response), now, transaction.idempotencyKey),
  ]);

  return json(response, httpStatus);
}
