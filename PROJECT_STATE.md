# MOSCOW — state v0.3.0

## Infrastructure

- Cloudflare Worker: `moscow-city-api`
- D1: `moscow-city-db`
- Durable Object: `EconomyCoordinator`
- Existing backend contract is unchanged from v0.2.0.

## v0.3.0 — First Playable Scene

The technical prototype was replaced by the first actual game scene.

Playable flow:

1. Start game
2. Player account is created with 200,000 ₽G
3. Apartment scene opens
4. Talk to the guide
5. Phone hotspot unlocks
6. Open the phone shop
7. Buy `starter_phone` for 15,000 ₽G through the existing Cloudflare API
8. Wallet becomes 185,000 ₽G
9. Inventory/progress refresh from the server
10. Exit-to-yard hotspot unlocks

## Frontend structure

- `web/src/App.jsx` — game state / orchestration
- `web/src/lib/api.js` — API client
- `web/src/components/ApartmentScene.jsx` — apartment scene
- `web/src/components/TopHud.jsx` — balance/status HUD
- `web/src/components/QuestPanel.jsx` — current tasks
- `web/src/components/DialogueBox.jsx` — guide dialogue
- `web/src/components/PhoneShopModal.jsx` — starter phone purchase
- `web/src/styles.css` — visual system and responsive scene

## Next vertical slice

`yard -> first city map -> first activity/job -> phone becomes navigation hub`

No new D1 migration is required for v0.3.0.
