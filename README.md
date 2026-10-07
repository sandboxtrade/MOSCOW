# MOSCOW

Официальная исходная база проекта MOSCOW.

## Что хранится в GitHub

Только исходники и конфигурация проекта. Не хранятся `node_modules`, `dist`, временные файлы Wrangler и локальные секреты.

## Структура

```text
MOSCOW/
├── api/                 Cloudflare Worker + D1 + Durable Object
│   ├── migrations/      схема базы данных
│   └── src/
│       ├── durable/     Durable Object
│       ├── lib/         общие backend-функции
│       ├── routes/      API-логика по областям
│       └── worker.js    входная точка API
├── web/                 React/Vite клиент игры
├── scripts/             проверки проекта и remote smoke-test
├── docs/                документация по разработке
├── package.json         общие команды проекта
└── PROJECT_STATE.md     текущее состояние проекта
```

## Первый запуск на новом ПК

```powershell
npm.cmd install
npm.cmd run check
npm.cmd run dev:web
```

## Backend локально

```powershell
npm.cmd run dev:api
```

## Проверка Cloudflare/D1

```powershell
npm.cmd run verify:cloudflare
```

## Remote smoke-test

```powershell
npm.cmd run test:remote
```

## Деплой API

```powershell
npm.cmd run deploy:api
```

## Current playable version

`v0.3.10` keeps the experience inside the first approved room and adds the generated player, guide, dialogue portrait and phone assets directly into the live scene. Walk-cycle frames are already stored for later movement work. Backend and database behavior are unchanged.

## Automatic deployment

From v0.3.6 the repository includes GitHub Actions for GitHub Pages and Cloudflare Worker deployment. One-time setup is documented in `docs/AUTO_DEPLOY.md`.
