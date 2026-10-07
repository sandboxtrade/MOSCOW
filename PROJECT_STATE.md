# MOSCOW — state v0.3.14

## Critical deployment note

The repository was inspected after the v0.3.13 report. `main` was actually still on **v0.3.10** and the latest successful GitHub Pages deploy was built from that v0.3.10 commit. That is why the phone still showed the old PNG-based apartment.

## v0.3.14

This archive is based on v0.3.13 and keeps the live faux-3D room + detailed vector characters. It also adds deploy diagnostics so stale/incorrect deployments are immediately obvious.

- visible `v0.3.14 · LIVE` build markers
- 12-second API timeout instead of an endless create-player wait
- render error boundary that shows the actual UI error instead of a blank screen
- no-cache HTML hints for easier device verification
- room/character work from v0.3.13 retained
- backend schema unchanged
- migrations `0001`–`0003` unchanged
- no `0004` migration

## Verification rule

After deployment the page must visibly show `v0.3.14 · LIVE` / `v0.3.14 · LIVE ROOM`. If it does not, the new build is not what GitHub Pages is serving.
