# MOSCOW

Mobile-first web game prototype.

## Current visual build

Version `0.3.14` continues the live faux-3D / 2.5D first room direction and adds a more deliberate art pass over both the room and the characters. The playable apartment still does **not** depend on a raster room background or PNG characters at runtime.

The goal of this branch is to prove that MOSCOW can keep a dimensional, animated, game-like scene without moving to a heavy real-3D stack yet.

## Project structure

```text
MOSCOW/
├── api/                 Cloudflare Worker + D1 + Durable Object
├── web/                 React/Vite game client
├── scripts/             verification / smoke test
├── docs/                project documentation
├── package.json
└── PROJECT_STATE.md
```

## Local

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run dev:web
```

## Backend

```powershell
npm.cmd run dev:api
npm.cmd run verify:cloudflare
npm.cmd run test:remote
npm.cmd run deploy:api
```

## Automatic deployment

GitHub Actions deploy the web build to GitHub Pages and the API to Cloudflare.


## Build verification

The deployed game shows a visible `v0.3.14 · LIVE` marker. If that marker is absent, GitHub Pages is serving an older build.
