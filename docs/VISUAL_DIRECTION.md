# MOSCOW — visual direction

## v0.3.15: live pixel room

The first apartment now uses a **live pixel-art scene** built in React + inline SVG + CSS.

The previous smooth faux-3D / cartoon vector pass from v0.3.14 is no longer the target look. The current direction keeps the advantages of a live expandable scene but changes the rendering language to hard-edged pixel art.

Core rules:

- the room is not a baked runtime PNG background;
- player/guide are not runtime PNG overlays;
- the room uses a low-resolution internal scene (`360×540`);
- SVG elements use `shape-rendering: crispEdges`;
- scaling is pixelated/crisp;
- forms are built from rectangles and hard polygons instead of smooth curves;
- lighting and ambient motion remain subtle and game-like;
- interaction hitboxes and UI remain independent from world rendering.

## Scene design language

- Modern Moscow apartment at night.
- Dense, lived-in panel-house interior.
- Cold city light from the window + small warm interior light sources.
- Pixel-art silhouettes and hard edges.
- Strong readable composition rather than abstract isometric blocks.
- The approved apartment image remains the composition/atmosphere reference: large night window, bed left, desk right, rug/table center, fridge/kitchen right.
- Animation should use stepped motion where possible so it does not break the pixel language.

## Interface rule

The UI keeps its own MOSCOW identity. The user's other game is only a reference for a living, expandable world — **not** a UI reference. Do not copy its navigation, cards, typography or layout.

## Current room structure

`ApartmentScene.jsx` currently contains:

1. pixel wallpaper + floor
2. window, skyline, curtains and city lights
3. radiator + pipes
4. posters
5. bed + nightstand
6. rug + coffee table + stool
7. desk + monitor + lamp + clutter
8. wall shelf + plant
9. fridge + microwave + kitchen block
10. door + hanging coat
11. pixel player + guide with talking state
12. in-world phone
13. stepped ambient animations
14. separate HTML interaction hitboxes

## Next visual priorities

1. Compare v0.3.15 with the real phone screenshot.
2. Refine room density/proportions without reverting to a single background image.
3. Refine pixel characters — especially head/torso readability and stance.
4. Add depth-aware occlusion around selected furniture.
5. Add small interaction states (monitor active, lamp toggle, phone pickup).
6. Only after this room reads correctly, reuse the same rendering system elsewhere.
