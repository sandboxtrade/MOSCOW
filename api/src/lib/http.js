export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
  };
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function pathPart(pathname, index) {
  return pathname.split("/").filter(Boolean)[index - 1];
}

export function parseMetadata(value) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function normalizeSolAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 1e9) / 1e9;
}
