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
