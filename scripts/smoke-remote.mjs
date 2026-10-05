import process from "node:process";

const API = process.env.MOSCOW_API_URL || "https://moscow-city-api.ermilov-stepa228337.workers.dev";
const results = [];
let accountId = "";

function pass(name, detail = "") {
  results.push({ name, ok: true });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, error) {
  results.push({ name, ok: false });
  console.error(`✗ ${name} — ${error instanceof Error ? error.message : error}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
  }

  return data;
}

async function check(name, fn) {
  try {
    const detail = await fn();
    pass(name, detail || "");
  } catch (error) {
    fail(name, error);
    throw error;
  }
}

async function main() {
  console.log(`MOSCOW remote smoke test\nAPI: ${API}`);
  console.log("Note: this creates one disposable test account in remote D1.\n");

  try {
    await check("Health", async () => {
      const data = await api("/health");
      assert(data.ok === true, "health.ok is not true");
      assert(data.verticalSlice === true, "verticalSlice is not deployed");
      return `version ${data.version ?? "unknown"}`;
    });

    await check("Create account", async () => {
      const data = await api("/account/create", { method: "POST" });
      accountId = data?.account?.id;
      assert(accountId, "account id missing");
      assert(data.account.status === "FREE", "new account status is not FREE");
      assert(data.wallet.rubNonWithdrawable === 200000, "starter balance is not 200000");
      assert(data.wallet.rubWithdrawable === 0, "starter withdrawable RUB must be 0");
      return accountId;
    });

    await check("Wallet initial state", async () => {
      const data = await api(`/wallet/${accountId}`);
      assert(data.wallet.rubTotal === 200000, `rubTotal=${data.wallet.rubTotal}`);
      assert(data.wallet.solAvailable === 0, `solAvailable=${data.wallet.solAvailable}`);
    });

    await check("Progress initial state", async () => {
      const data = await api(`/progress/${accountId}`);
      assert(data.onboardingStep === "MEET_GUIDE", `step=${data.onboardingStep}`);
      assert(data.phoneOwned === false, "phoneOwned must be false");
    });

    await check("Inventory initial state", async () => {
      const data = await api(`/inventory/${accountId}`);
      assert(data.count === 0, `inventory count=${data.count}`);
    });

    const depositKey = `smoke-deposit-${crypto.randomUUID()}`;

    await check("TEST SOL deposit", async () => {
      const data = await api("/test-sol/deposit", {
        method: "POST",
        headers: { "Idempotency-Key": depositKey },
        body: JSON.stringify({ accountId, amount: 1 }),
      });
      assert(data.wallet.solAvailable === 1, `solAvailable=${data.wallet.solAvailable}`);
      assert(data.status === "FUNDED", `status=${data.status}`);
    });

    await check("Idempotency replay", async () => {
      const data = await api("/test-sol/deposit", {
        method: "POST",
        headers: { "Idempotency-Key": depositKey },
        body: JSON.stringify({ accountId, amount: 1 }),
      });
      assert(data.idempotentReplay === true, "idempotentReplay missing");
      assert(data.wallet.solAvailable === 1, `duplicate deposit changed SOL to ${data.wallet.solAvailable}`);
    });

    await check("SOL -> ₽G", async () => {
      const data = await api("/exchange/sol-to-rub", {
        method: "POST",
        headers: { "Idempotency-Key": `smoke-sol-rub-${crypto.randomUUID()}` },
        body: JSON.stringify({ accountId, amount: 0.1 }),
      });
      assert(data.wallet.solAvailable === 0.9, `solAvailable=${data.wallet.solAvailable}`);
      assert(data.wallet.rubWithdrawable === 22500, `rubWithdrawable=${data.wallet.rubWithdrawable}`);
    });

    await check("₽G -> SOL", async () => {
      const data = await api("/exchange/rub-to-sol", {
        method: "POST",
        headers: { "Idempotency-Key": `smoke-rub-sol-${crypto.randomUUID()}` },
        body: JSON.stringify({ accountId, amount: 22500 }),
      });
      assert(data.wallet.solAvailable === 1, `solAvailable=${data.wallet.solAvailable}`);
      assert(data.wallet.rubWithdrawable === 0, `rubWithdrawable=${data.wallet.rubWithdrawable}`);
    });

    await check("TEST SOL withdraw", async () => {
      const data = await api("/test-sol/withdraw", {
        method: "POST",
        headers: { "Idempotency-Key": `smoke-withdraw-${crypto.randomUUID()}` },
        body: JSON.stringify({ accountId, amount: 0.25 }),
      });
      assert(data.wallet.solAvailable === 0.75, `solAvailable=${data.wallet.solAvailable}`);
    });

    const buyKey = `smoke-phone-${crypto.randomUUID()}`;

    await check("Buy starter phone", async () => {
      const data = await api("/shop/buy", {
        method: "POST",
        headers: { "Idempotency-Key": buyKey },
        body: JSON.stringify({ accountId, itemId: "starter_phone" }),
      });
      assert(data.purchase.item.id === "starter_phone", "wrong item purchased");
      assert(data.wallet.rubNonWithdrawable === 185000, `rubNonWithdrawable=${data.wallet.rubNonWithdrawable}`);
      assert(data.progress.phoneOwned === true, "phoneOwned not true");
    });

    await check("Purchase idempotency replay", async () => {
      const data = await api("/shop/buy", {
        method: "POST",
        headers: { "Idempotency-Key": buyKey },
        body: JSON.stringify({ accountId, itemId: "starter_phone" }),
      });
      assert(data.idempotentReplay === true, "idempotentReplay missing");
      assert(data.wallet.rubNonWithdrawable === 185000, "phone charged twice");
    });

    await check("Progress after purchase", async () => {
      const data = await api(`/progress/${accountId}`);
      assert(data.onboardingStep === "PHONE_PURCHASED", `step=${data.onboardingStep}`);
      assert(data.phoneOwned === true, "phoneOwned not true");
    });

    await check("Inventory after purchase", async () => {
      const data = await api(`/inventory/${accountId}`);
      assert(data.count === 1, `inventory count=${data.count}`);
      assert(data.items.some((item) => item.itemId === "starter_phone"), "starter_phone missing");
    });

    await check("Ledger", async () => {
      const data = await api(`/ledger/${accountId}`);
      const types = new Set(data.entries.map((entry) => entry.type));
      for (const type of [
        "STARTER_GRANT",
        "TEST_SOL_DEPOSIT",
        "SOL_TO_RUB",
        "RUB_TO_SOL",
        "TEST_SOL_WITHDRAWAL",
        "SHOP_PURCHASE",
      ]) {
        assert(types.has(type), `${type} missing from ledger`);
      }
      return `${data.count} ledger entries`;
    });

    await check("Final wallet", async () => {
      const data = await api(`/wallet/${accountId}`);
      assert(data.account.status === "FUNDED", `status=${data.account.status}`);
      assert(data.wallet.solAvailable === 0.75, `solAvailable=${data.wallet.solAvailable}`);
      assert(data.wallet.rubWithdrawable === 0, `rubWithdrawable=${data.wallet.rubWithdrawable}`);
      assert(data.wallet.rubNonWithdrawable === 185000, `rubNonWithdrawable=${data.wallet.rubNonWithdrawable}`);
      assert(data.wallet.rubTotal === 185000, `rubTotal=${data.wallet.rubTotal}`);
    });
  } catch {
    // Individual failure already printed. Stop to avoid compounding state errors.
  }

  const failed = results.filter((result) => !result.ok);
  console.log("\n────────────────────────────────────");
  console.log(`${results.length - failed.length}/${results.length} checks passed`);

  if (failed.length) {
    console.error("REMOTE SMOKE TEST FAILED");
    if (accountId) console.error(`Test account: ${accountId}`);
    process.exit(1);
  }

  console.log("REMOTE SMOKE TEST PASSED");
  console.log(`Test account: ${accountId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
