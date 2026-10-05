# Development rules

1. GitHub is the source of truth for source code.
2. Do not commit `node_modules`, `dist`, `.wrangler`, `.env` or temporary files.
3. Database changes are added only as new numbered migrations. Never rewrite an already-applied migration.
4. Before deploy: `npm.cmd run check`.
5. After meaningful backend deploy: `npm.cmd run test:remote`.
6. Build the game in vertical slices so each milestone is visible in the frontend.
7. Keep `worker.js` small. Put business logic in `routes/`, shared helpers in `lib/`, and Durable Object logic in `durable/`.
