# MOSCOW — visual direction

## Approved apartment background

The current approved base background for the first apartment scene is:

`web/public/assets/apartment-room-approved.png`

This image was approved after removing all HUD, dialogue windows, characters and interaction markers from the earlier reference screen.

## Current visual direction

- Mobile-first vertical game presentation.
- Detailed pixel-art / pixel-styled 2D scene.
- Moscow panel-apartment atmosphere at night.
- Gritty, lived-in, low-income interior; not cozy fantasy and not isometric dollhouse art.
- UI should be layered over the scene, not baked into the background.
- Character, guide, phone hotspot, exit hotspot, HUD, quests and dialogue should remain separate assets/components.

## Next asset priorities

1. Player character sprites: front/back/left/right + walking frames.
2. Guide sprite: full-body neutral pose first, more poses later.
3. Phone interactive object: transparent PNG, normal + highlighted states.
4. Exit/door interaction marker.
5. Workstation/computer interaction marker.
6. HUD icon set.
7. Dialogue portrait + frame.
8. Quest panel visual pass.

Do not generate large texture packs yet. Build the first room as a finished vertical slice first.

## v0.3.2 implementation status

The approved apartment background is integrated directly into `ApartmentScene` at its native 2:3 portrait ratio. Interior furniture/window/room geometry must not be recreated in CSS. CSS/React overlays are reserved for gameplay layers and interface only.

Current overlay layers:

- player
- guide
- phone interaction
- workstation interaction
- door / exit interaction

Character visuals are temporary lightweight scene sprites until dedicated transparent pixel-art assets are produced. Replacing them later must not require changing the background or UI component structure.
