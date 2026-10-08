# Обновление 0.3.17

Актуальная версия: 0.3.17. Первая комната и анимации переработаны; подробности в docs/ROOM_ANIMATION.md. Ниже сохранены предыдущие сведения.

# MOSCOW

Mobile-first web game prototype.

## Current visual build

`v0.3.16` is a live pixel-art rebuild of the first room. The apartment is generated from React + inline SVG + CSS using crisp pixel geometry rather than a raster room background or smooth cartoon faux-3D characters.

## Project structure

```text
MOSCOW/
├── api/
├── web/
├── scripts/
├── docs/
├── package.json
└── PROJECT_STATE.md
```

## Local

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run dev:web
```

## Deploy

GitHub Actions deploy the web build to GitHub Pages and the API to Cloudflare.

## Art iteration

The apartment uses authored procedural detail on top of the React/SVG pixel-room. Adjust the pixel scene in `web/src/components/ApartmentScene.jsx` and its animation/surface styling in `web/src/styles.css`. No replacement room PNG is required. Notes and coordinate reference: `docs/ROOM_PIXEL_ART.md`.
