const API =
  import.meta.env.VITE_API_URL ||
  "https://moscow-city-api.ermilov-stepa228337.workers.dev";

export async function apiRequest(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || data.message || `HTTP_${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export async function loadPlayer(accountId) {
  const [walletData, progressData, inventoryData] = await Promise.all([
    apiRequest(`/wallet/${accountId}`),
    apiRequest(`/progress/${accountId}`),
    apiRequest(`/inventory/${accountId}`),
  ]);

  return {
    wallet: walletData.wallet,
    account: walletData.account,
    progress: progressData,
    inventory: inventoryData.items || [],
  };
}

export async function createPlayer() {
  return apiRequest("/account/create", { method: "POST" });
}

export async function purchaseStarterPhone(accountId) {
  return apiRequest("/shop/buy", {
    method: "POST",
    headers: {
      "Idempotency-Key": `starter-phone-${accountId}`,
    },
    body: JSON.stringify({
      accountId,
      itemId: "starter_phone",
    }),
  });
}
