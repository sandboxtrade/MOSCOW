# File map

## Root

- `package.json` — common commands for both workspaces.
- `.gitignore` — prevents generated files from entering GitHub.
- `PROJECT_STATE.md` — current product/technical state.
- `README.md` — quick start.

## api

- `src/worker.js` — HTTP routing only.
- `src/config.js` — economy constants.
- `src/durable/EconomyCoordinator.js` — serialized economy commands.
- `src/lib/db.js` — common D1 reads/formatters.
- `src/lib/http.js` — request/response helpers.
- `src/lib/transactions.js` — transactions + idempotency.
- `src/routes/accounts.js` — player creation.
- `src/routes/read.js` — wallet/progress/inventory/ledger reads.
- `src/routes/economy.js` — shop, TEST SOL and exchange operations.
- `migrations/` — immutable D1 migrations.
- `wrangler.jsonc` — Cloudflare bindings/config.

## web

- `src/App.jsx` — current playable prototype screen.
- `src/styles.css` — current UI styling.
- `src/main.jsx` — React entrypoint.
- `.env.example` — API URL example.

## scripts

- `verify-cloudflare.mjs` — read-only Cloudflare/D1 contract verification.
- `smoke-remote.mjs` — end-to-end remote API smoke test.
