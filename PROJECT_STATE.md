# MOSCOW — state v0.3.7

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

## Visual update — v0.3.1 handoff

- Approved first-apartment background added at `web/public/assets/apartment-room-approved.png`.
- The approved background contains no HUD, characters, dialogue or interaction markers.
- Next milestone: integrate this background into `ApartmentScene` and rebuild the first room as layered game UI + sprites over the background.

## v0.3.2 — Approved apartment scene integration

- `web/public/assets/apartment-room-approved.png` is now the single visual background for the first room.
- Removed the duplicate CSS-built apartment interior that conflicted with the approved art.
- `ApartmentScene` now uses independent overlay layers for the player, guide, phone, workstation and exit.
- Existing guide -> phone purchase -> exit unlock flow is preserved.
- Workstation is an inspectable frontend-only interaction; no backend contract or D1 schema changes were required.
- HUD, quests, dialogue, shop modal and bottom navigation remain separate React UI components/layers.
- UI palette was consolidated around dark navy surfaces with blue/cyan interaction accents.
- Mobile-first portrait layout now follows the approved background's native 2:3 aspect ratio.

No D1 migration was added for v0.3.2. Migrations `0001`-`0003` remain unchanged.

## v0.3.6 automation

- GitHub Pages deployment is automated through `.github/workflows/pages.yml`.
- Cloudflare Worker deployment, D1 migration apply, and remote smoke test are automated through `.github/workflows/cloudflare.yml`.
- Backend currently remains version `0.2.2` with the v0.3.5 network-reset-resistant smoke test.
- Existing D1 migrations `0001`-`0003` were not modified. No `0004` migration was added.

## v0.3.7 — Pages asset fix + first phone UI

- Public asset URLs now use Vite `import.meta.env.BASE_URL`, so the approved apartment background works both locally and under GitHub Pages `/MOSCOW/`.
- The start screen uses the same base-safe approved room image instead of a root-relative CSS URL.
- Added a minimal frontend-only starter phone screen after `starter_phone` is owned: room shortcut, locked map/wallet/contacts placeholders, current balances and a guide message preview.
- Interaction zones now get a subtle hover/focus affordance without redrawing room geometry.
- Backend contract and D1 schema are unchanged. No `0004` migration was added.
