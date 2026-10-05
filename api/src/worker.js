import { TEST_SOL_TO_RUBG } from "./config.js";
import { EconomyCoordinator } from "./durable/EconomyCoordinator.js";
import { getAccount } from "./lib/db.js";
import { corsHeaders, json, pathPart, readJson } from "./lib/http.js";
import { createAccount } from "./routes/accounts.js";
import {
  getInventory,
  getLedger,
  getProgress,
  getWallet,
} from "./routes/read.js";

export { EconomyCoordinator };

const ECONOMY_ROUTES = new Set([
  "/test-sol/deposit",
  "/test-sol/withdraw",
  "/exchange/sol-to-rub",
  "/exchange/rub-to-sol",
  "/shop/buy",
]);

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders() });
      }

      if (request.method === "GET" && url.pathname === "/health") {
        return json({
          ok: true,
          service: "moscow-city-api",
          version: "0.2.2",
          verticalSlice: true,
          transactionEngine: true,
          idempotency: true,
          testSolRubGRate: TEST_SOL_TO_RUBG,
        });
      }

      if (request.method === "POST" && url.pathname === "/account/create") {
        return createAccount(env);
      }

      const readRoutes = [
        ["/wallet/", getWallet],
        ["/ledger/", getLedger],
        ["/progress/", getProgress],
        ["/inventory/", getInventory],
      ];

      for (const [prefix, handler] of readRoutes) {
        if (request.method === "GET" && url.pathname.startsWith(prefix)) {
          const accountId = pathPart(url.pathname, 2);
          return accountId
            ? handler(env, accountId)
            : json({ error: "ACCOUNT_ID_REQUIRED" }, 400);
        }
      }

      if (request.method === "POST" && ECONOMY_ROUTES.has(url.pathname)) {
        const body = await readJson(request);
        const accountId = body.accountId;

        if (!accountId) {
          return json({ error: "ACCOUNT_ID_REQUIRED" }, 400);
        }

        const account = await getAccount(env, accountId);
        if (!account) {
          return json({ error: "ACCOUNT_NOT_FOUND" }, 404);
        }

        const durableId = env.ECONOMY.idFromName(accountId);
        const stub = env.ECONOMY.get(durableId);
        const headers = new Headers(request.headers);
        headers.set("Content-Type", "application/json");

        return await stub.fetch(
          new Request(request.url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          }),
        );
      }

      return json({ error: "NOT_FOUND" }, 404);
    } catch (error) {
      console.error(error);
      return json(
        {
          error: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Unknown error",
        },
        500,
      );
    }
  },
};
