# Automatic deploy setup

MOSCOW v0.3.6 includes two GitHub Actions workflows.

## Web / GitHub Pages

Workflow: `.github/workflows/pages.yml`

It builds `web/` and deploys `web/dist` to GitHub Pages whenever frontend files change on `main`.

One-time repository setting:

1. GitHub repository -> Settings -> Pages.
2. Under Build and deployment, set Source to **GitHub Actions**.

No branch/folder selection is required.

The workflow builds with:

- `VITE_BASE_PATH=/MOSCOW/`
- `VITE_API_URL=https://moscow-city-api.ermilov-stepa228337.workers.dev`

## API / Cloudflare

Workflow: `.github/workflows/cloudflare.yml`

It runs when backend files change on `main`:

1. installs dependencies;
2. applies any not-yet-applied D1 migrations;
3. deploys `moscow-city-api`;
4. runs the remote smoke test.

One-time repository secrets required in GitHub -> Settings -> Secrets and variables -> Actions:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API token must be able to deploy Workers and modify the D1 database used by this project.

Existing migrations `0001`-`0003` remain unchanged. New schema changes must be added as `0004_...sql` and later.
