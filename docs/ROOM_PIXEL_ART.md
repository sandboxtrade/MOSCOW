# Room pixel-art notes (MOSCOW v0.3.16)

## Projection and coordinates

First room is a live SVG authored in `web/src/components/ApartmentScene.jsx` with a fixed **360×540** viewport. CSS `image-rendering: pixelated` and SVG `shape-rendering: crispEdges` keep pixel boundaries hard when scaled up for a portrait phone. Objects are drawn from back to front. Change items in their named SVG group; don't draw a raster background over the scene.

## Anchors

| Item | Approximate coordinate range |
| --- | --- |
| Window | x86–256, y36–176 |
| Radiator | x126–219, y182–251 |
| Bed | x0–132, y250–375 |
| Desk + computer | x233–351, y190–334 |
| Phone object | x226–236, y312–328 |
| Fridge | x299–354, y307–410 |
| Rug | x46–292, y345–494 |
| Player ground anchor | x150, y439 |
| Guide ground anchor | x248, y414 |

CSS hotspot overlay positions (`.pixelRoomScene .guideTarget`, `.phoneTarget`, `.workstationTarget`) are percentages of the viewport. If character/table/phone placement changes, adjust hotspots accordingly.

## Layout / detail primitives

- `SurfaceWear` renders deterministic small scuffs/wear patterns. `rand01()` has no state or timers, so re-rendering doesn't cause visual flicker.
- `CityDepth` adds far and near building layers and limited opacity animation on distant windows. A `clipPath` keeps all urban shapes inside the glass.
- `BedTextile`, `PixelDeskChair`, `ApartmentClutter` add smaller authored furniture/fabric/prop details.
- `PixelBitmapText` draws Cyrillic pixel lettering on the paper poster using 3×5 glyphs.
- `LightingAndWear` and `PixelLampGlowFields` add low-opacity sharp-edged light pools for depth.
- `PixelPerson` contains live player/guide SVG sprites (idle/talk state). Guide wears the checked top and cross-body bag.

## Performance and accessibility

- All detail positions are deterministic.
- Keep the number of opacity-animated city window rectangles small. Static windows are cheap; animating hundreds of SVG elements is not.
- Do not add heavy blurs/complex SVG filters or mousemove React state updates on mobile.
- CSS uses `prefers-reduced-motion` to disable room animations.
- Game controls, DOM buttons, HUD, dialogue, phone and economy remain React components outside the SVG.

## Visual limitations

Code-drawn pixel art is editable and animated, but cannot automatically reproduce the illustrated reference's painted detail. A hand-authored tile atlas or Blockbench scene will still be needed to reach that exact fidelity. The runtime can keep the same gameplay layer when upgrading the renderer.
