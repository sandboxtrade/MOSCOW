# MOSCOW — state v0.2.0

## Infrastructure

- Cloudflare Worker: `moscow-city-api`
- D1: `moscow-city-db`
- D1 binding: `DB`
- Durable Object binding: `ECONOMY`
- Durable Object class: `EconomyCoordinator`
- Worker URL: `https://moscow-city-api.ermilov-stepa228337.workers.dev`

## Backend already covered

- FREE / FUNDED account state
- 200,000 ₽G starter balance
- starter balance is NON_WITHDRAWABLE
- TEST SOL deposit / withdrawal
- SOL ↔ ₽G test exchange
- ledger
- transactions
- idempotency
- player progress
- catalog
- inventory
- purchases
- starter phone purchase

## First playable vertical slice

1. Create player
2. Receive 200,000 ₽G
3. Meet guide
4. Buy `starter_phone` for 15,000 ₽G
5. Balance becomes 185,000 ₽G
6. Phone enters inventory
7. `phone_owned = true`
8. onboarding becomes `PHONE_PURCHASED`

## Current development direction

The infrastructure/recovery phase is considered complete. New work should be done as visible vertical slices: frontend + only the backend required for that specific mechanic.

Next: replace the technical apartment prototype with the real visual first scene of MOSCOW.
