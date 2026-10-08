# Обновление 0.3.17

Актуальная версия: 0.3.17. Первая комната и анимации переработаны; подробности в docs/ROOM_ANIMATION.md. Ниже сохранены предыдущие сведения.

# MOSCOW — state v0.3.16

## Infrastructure

- React + Vite frontend
- Cloudflare Worker `moscow-city-api`
- D1 `moscow-city-db`
- Durable Object `EconomyCoordinator`
- GitHub Pages + Cloudflare automatic deployment
- Backend contract unchanged

## v0.3.16 — live pixel-room rebuild

This patch replaces the smooth cartoon/isometric room renderer from v0.3.14 with a code-driven pixel-art room. The scene is still generated live in React/SVG/CSS and does not fall back to the old apartment PNG.

### Visual direction

- low-resolution internal SVG coordinate system (`360×540`)
- `shape-rendering: crispEdges` and pixelated scaling
- no rounded vector people
- no smooth faux-3D blocks as the primary visual language
- direct room composition closer to the approved apartment reference: large night window, bed left, desk right, fridge/kitchen right, rug + coffee table in the center

### Room details

- night skyline with blinking windows
- curtains and window glints
- radiator, pipes and wallpaper
- posters
- bed, nightstand, rug, coffee table, stool
- desk, monitor, keyboard/laptop, lamp and desk clutter
- wall shelf and plant
- fridge, microwave, kitchen block and hanging coat
- foreground shelf for depth
- live phone prop
- subtle dust and lighting effects

### Characters

- player and guide redrawn as actual blocky pixel characters
- guide keeps plaid jacket, bag and strap identity
- talking pose remains live
- characters use hard pixel blocks instead of smooth vector curves

### Gameplay/data

- existing interaction flow preserved
- phone purchase preserved
- dialogue/quests/HUD preserved
- no backend changes
- migrations `0001`–`0003` unchanged
- no `0004` migration

## Deploy marker

After deploy the room shows `v0.3.16 · PIXEL ROOM`. If that marker is not visible, GitHub Pages is not serving this build.

## v0.3.16 — detailed pixel-art pass on top of v0.3.15

- Kept the code-driven `360×540` SVG pixel-world (no new room PNG is used at runtime).
- Rebuilt the city beyond the window into a layered near/far skyline, with deterministic windows and a restrained animated red beacon. The scene's pixel-grid remains crisp.
- Added hand-controlled surface variation: wall wear, plaster stains, floorboard scratches/variations, and rug details/fringe; deterministic generation avoids flickering between renders.
- Added pixel lettering to the Moscow poster (3×5 Cyrillic glyphs built as rectangles), poster silhouette and extra wall decor.
- Added checkered fabric folds on the bed, paper clutter and coffee details on the table, additional desk wiring, radiator pipes, shelf highlights, sockets, fridge details and a compact office chair.
- Redrew the existing player/guide sprite details: hair silhouette, facial shading, clothes seams, cargo pockets, cuffs, shoe laces and guide crossbody bag/plaid.
- Introduced stepped, low-opacity light bands around the desk and window and time-separated city/lamp animations. Animated only a subset of distant city windows to reduce compositing work on mobile.
- Updated start screen story copy; removed internal developer explanations from the player-facing introduction.
- Preserved Cloudflare Worker, D1, all wallet/phone/quests/dialogue flow and GitHub deployment workflows.
- Kept migrations 0001–0003 unchanged; no 0004 migration.

### Validation
- JSX transpilation and rendered SVG preview were verified locally.
- Full Vite build still requires `npm install` and should be checked by the existing GitHub Pages workflow after deployment.
- The visible release marker is `v0.3.16 · PIXEL ROOM`.
