import { readJson, json } from "../lib/http.js";
import { runIdempotent } from "../lib/transactions.js";
import {
  buyItem,
  depositTestSol,
  exchangeRubToSol,
  exchangeSolToRub,
  withdrawTestSol,
} from "../routes/economy.js";

export class EconomyCoordinator {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

  async fetch(request) {
    try {
      const url = new URL(request.url);
      const body = await readJson(request);
      const accountId = body.accountId;

      if (!accountId) {
        return json({ error: "ACCOUNT_ID_REQUIRED" }, 400);
      }

      const clientKey =
        request.headers.get("Idempotency-Key") ||
        body.idempotencyKey ||
        crypto.randomUUID();

      const common = {
        accountId,
        endpoint: url.pathname,
        clientKey,
        payload: body,
      };

      if (url.pathname === "/test-sol/deposit") {
        return await runIdempotent(this.env, {
          ...common,
          type: "TEST_SOL_DEPOSIT",
          execute: (transaction) =>
            depositTestSol(this.env, transaction, body.amount),
        });
      }

      if (url.pathname === "/test-sol/withdraw") {
        return await runIdempotent(this.env, {
          ...common,
          type: "TEST_SOL_WITHDRAWAL",
          execute: (transaction) =>
            withdrawTestSol(this.env, transaction, body.amount),
        });
      }

      if (url.pathname === "/exchange/sol-to-rub") {
        return await runIdempotent(this.env, {
          ...common,
          type: "SOL_TO_RUB",
          execute: (transaction) =>
            exchangeSolToRub(this.env, transaction, body.amount),
        });
      }

      if (url.pathname === "/exchange/rub-to-sol") {
        return await runIdempotent(this.env, {
          ...common,
          type: "RUB_TO_SOL",
          execute: (transaction) =>
            exchangeRubToSol(this.env, transaction, body.amount),
        });
      }

      if (url.pathname === "/shop/buy") {
        return await runIdempotent(this.env, {
          ...common,
          type: "SHOP_PURCHASE",
          execute: (transaction) =>
            buyItem(this.env, transaction, body.itemId),
        });
      }

      return json({ error: "ECONOMY_ROUTE_NOT_FOUND" }, 404);
    } catch (error) {
      console.error(error);
      return json(
        {
          error: "ECONOMY_INTERNAL_ERROR",
          message: error?.message || "Unknown error",
        },
        500,
      );
    }
  }
}
