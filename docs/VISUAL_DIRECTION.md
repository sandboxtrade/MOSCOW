# MOSCOW — visual direction

## v0.3.12: live faux-3D room

The first apartment has changed visual direction. The previous runtime composition based on a raster room background plus transparent PNG characters is no longer the target architecture.

The current room is now built as a **live 2.5D / faux-3D vector scene** inside React/SVG/CSS:

- no raster room background is required at runtime;
- no character PNG is required at runtime;
- no phone PNG is required at runtime;
- room geometry is drawn from live vector planes/blocks;
- furniture, walls, window, light, characters and small props are independent scene elements;
- ambient motion is produced by CSS/SVG animation rather than video or baked frames;
- interaction targets and UI stay independent from world rendering.

This is intentionally **not real-time full 3D**. The goal is a mobile-friendly scene that feels dimensional, alive and expandable without introducing a heavy 3D engine yet.

## Scene design language

- Modern Moscow night atmosphere.
- Dark, restrained palette with cold city light and small warm interior light sources.
- Geometric stylization rather than photorealism.
- Strong depth hierarchy and readable silhouettes.
- World motion must stay subtle: monitor scan, city lights, dust, light breathing, character idle motion and tiny pointer parallax.
- Interaction markers should feel like MOSCOW UI, not like the interface of any other project.

## Interface rule

The UI keeps its own MOSCOW identity. The other user's game is only a reference for the idea of a living expandable world, **not** a UI reference. Do not copy its card shapes, navigation structure, typography or layout.

## Current room structure

`ApartmentScene.jsx` contains a live vector world:

1. cutaway room shell (floor + two walls)
2. window + animated city skyline
3. bed / nightstand / radiator
4. rug / coffee table
5. desk / monitor / lamp
6. fridge / door
7. vector player and guide
8. phone prop
9. ambient lighting / dust / scan overlay
10. separate HTML interaction hitboxes

## Next visual priorities

1. Improve proportions and composition after seeing the live build on phone.
2. Refine vector characters (faces/clothing silhouettes) without returning to large PNG overlays.
3. Add depth-aware occlusion for characters behind selected furniture.
4. Add small room interaction states (monitor active, lamp toggle, phone pickup).
5. Only after the first room reads well, reuse the same scene system for later interiors.

The old `apartment-room-approved.png` remains useful only as historical art direction reference; it is no longer required by the live room renderer.
