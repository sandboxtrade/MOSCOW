# MOSCOW — state v0.3.11

## Infrastructure

- Cloudflare Worker: `moscow-city-api`
- D1: `moscow-city-db`
- Durable Object: `EconomyCoordinator`
- Existing backend contract remains unchanged from the v0.3.5+ line.

## Current playable room slice

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
10. Room remains the current vertical slice; city/yard expansion is intentionally paused

## Frontend structure

- `web/src/App.jsx` — game state / orchestration / start screen
- `web/src/lib/api.js` — API client
- `web/src/components/ApartmentScene.jsx` — apartment scene and interaction overlays
- `web/src/components/TopHud.jsx` — balance/status HUD
- `web/src/components/QuestPanel.jsx` — current tasks
- `web/src/components/DialogueBox.jsx` — guide dialogue
- `web/src/components/PhoneShopModal.jsx` — starter phone purchase
- `web/src/components/PhonePanel.jsx` — in-game phone screen
- `web/src/styles.css` — full visual system and responsive layout

## v0.3.9 — ambient room + second UI pass

- This patch stays inside the first room. No yard/city gameplay was added.
- The approved room background remains the only environment image. No duplicate CSS interior geometry was introduced.
- Added subtle ambience to make the room feel less static:
  - soft glow from the window / city zone
  - light twinkle in the outside skyline
  - soft desk-lamp / bulb glow
  - faint drifting ambient light and animated grain
  - minimal idle motion on placeholder characters and phone hotspot
- Repositioned the temporary player/guide sprites so they sit more naturally in the room composition instead of looking randomly overlaid.
- Refined start screen presentation to better serve as a temporary playable intro before later video-based story scenes.
- Continued interface cleanup across HUD, objective block, dialogue and scene framing so the room image stays the main focus.
- Placeholder pixel characters are intentionally still temporary and should be replaced later by real transparent character assets from the user.
- Backend and D1 schema are unchanged. No `0004` migration was added. Existing migrations `0001`-`0003` remain untouched.

## Next visual step

`replace temporary character + phone placeholders with user-provided art -> keep polishing first room -> only then move forward to new spaces`


## v0.3.10 — generated character and phone assets integrated

- Replaced the temporary CSS-built player and guide figures in the room with generated transparent PNG character assets.
- The guide now switches from idle art to a separate talking/gesture art while dialogue is open.
- Added a dedicated generated guide portrait to the dialogue box.
- Replaced the CSS phone prop in the room with a generated transparent phone asset.
- Replaced the CSS phone mockup in the shop modal with the generated front-facing phone frame asset.
- Added generated player walk-cycle frames (`player-walk-1.png`, `player-walk-2.png`) to the project now so movement can use the same character design later without another asset migration.
- Repositioned the new full-size character art to sit naturally on the apartment floor and kept labels / interaction hit areas separate from the art.
- Backend, Cloudflare bindings and D1 schema are unchanged. Migrations `0001`-`0003` remain untouched and no `0004` migration was added.


## v0.3.11 — character visibility hotfix

- Fixed generated player/guide PNGs rendering at zero size on the apartment scene.
- Character scale now derives from apartment width instead of a zero-height anchor.
- Guide idle/talk artwork keeps approximately the same perceived height.
- Generated assets themselves are unchanged.
- Backend and D1 are unchanged; migrations `0001`-`0003` remain untouched and no `0004` was added.
