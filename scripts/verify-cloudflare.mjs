import { spawnSync } from "node:child_process";
import process from "node:process";

const DB_NAME = "moscow-city-db";
const API_URL = process.env.MOSCOW_API_URL || "https://moscow-city-api.ermilov-stepa228337.workers.dev";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

const checks = [];

function ok(name, detail = "") {
  checks.push({ name, ok: true, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  checks.push({ name, ok: false, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ""}`);
}

function runWrangler(command) {
  const result = spawnSync(
    npx,
    [
      "wrangler",
      "d1",
      "execute",
      DB_NAME,
      "--remote",
      "--command",
      command,
    ],
    {
      cwd: new URL("../api/", import.meta.url),
      encoding: "utf8",
      shell: false,
      env: process.env,
    },
  );

  const output = `${result.stdout || ""}\n${result.stderr || ""}`;

  if (result.status !== 0) {
    throw new Error(output.trim() || `wrangler exited with ${result.status}`);
  }

  return output;
}

function requireFragments(text, fragments, label) {
  const missing = fragments.filter((fragment) => !text.includes(fragment));
  if (missing.length) {
    throw new Error(`${label}: missing ${missing.join(", ")}`);
  }
}

async function main() {
  console.log("MOSCOW Cloudflare verification\n");

  try {
    const tables = runWrangler(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
    );

    requireFragments(
      tables,
      [
        "accounts",
        "wallets",
        "ledger_entries",
        "transactions",
        "idempotency_keys",
        "player_progress",
        "catalog_items",
        "inventory",
        "purchases",
      ],
      "remote tables",
    );

    ok("Remote D1 tables", "9 required tables found");
  } catch (error) {
    fail("Remote D1 tables", error.message);
  }

  const schemaExpectations = {
    accounts: ["id", "status", "created_at"],
    wallets: [
      "account_id",
      "sol_available",
      "sol_locked",
      "rub_withdrawable",
      "rub_non_withdrawable",
      "rub_locked",
    ],
    ledger_entries: [
      "id",
      "account_id",
      "type",
      "currency",
      "amount",
      "balance_class",
      "status",
      "reference_id",
      "metadata",
      "created_at",
    ],
    transactions: [
      "id",
      "account_id",
      "type",
      "status",
      "idempotency_key",
      "reference_id",
      "request_payload",
      "result_payload",
      "error_code",
      "created_at",
      "completed_at",
    ],
    idempotency_keys: [
      "key",
      "account_id",
      "endpoint",
      "status",
      "response_status",
      "response_body",
      "transaction_id",
      "created_at",
      "completed_at",
    ],
    player_progress: [
      "account_id",
      "onboarding_step",
      "phone_owned",
      "tutorial_completed",
      "updated_at",
    ],
    catalog_items: ["id", "type", "name", "price_rub", "enabled", "metadata"],
    inventory: ["id", "account_id", "item_id", "acquired_at", "metadata"],
    purchases: [
      "id",
      "account_id",
      "item_id",
      "price_rub",
      "balance_class",
      "transaction_id",
      "created_at",
    ],
  };

  for (const [table, columns] of Object.entries(schemaExpectations)) {
    try {
      const schema = runWrangler(`PRAGMA table_info(${table});`);
      requireFragments(schema, columns, table);
      ok(`Schema ${table}`, `${columns.length} required columns found`);
    } catch (error) {
      fail(`Schema ${table}`, error.message);
    }
  }

  try {
    const item = runWrangler(
      "SELECT id, type, name, price_rub, enabled FROM catalog_items WHERE id='starter_phone';",
    );
    requireFragments(item, ["starter_phone", "PHONE", "15000"], "starter phone");
    ok("Starter phone catalog item", "starter_phone = 15,000 ₽G");
  } catch (error) {
    fail("Starter phone catalog item", error.message);
  }

  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    if (!response.ok || data?.service !== "moscow-city-api") {
      throw new Error(`unexpected health response: HTTP ${response.status}`);
    }
    ok("Remote Worker health", `HTTP ${response.status}, version ${data.version ?? "unknown"}`);

    if (data.verticalSlice === true) {
      ok("Remote Worker vertical slice", "already deployed");
    } else {
      console.log("• Remote Worker vertical slice — not deployed yet (expected during recovery)");
    }
  } catch (error) {
    fail("Remote Worker health", error.message);
  }

  const failed = checks.filter((check) => !check.ok);
  console.log("\n────────────────────────────────────");
  console.log(`${checks.length - failed.length}/${checks.length} checks passed`);

  if (failed.length) {
    console.error("Cloudflare verification FAILED. Do not deploy yet.");
    process.exit(1);
  }

  console.log("Cloudflare verification PASSED.");
  console.log("The source matches the required remote D1 contract.");
  console.log("Next step: npm.cmd run deploy:api, then npm.cmd run test:remote");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
