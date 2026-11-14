# Zenith project rename

## Changes

- Renamed the root package to `umaxica-apps-edge-zenith` and the twenty deployment packages and Workers to `umaxica-apps-edge-zenith-*`.
- Updated package filters, Worker hostname policies and tests, repository URLs, development image and Compose project names, Dev Container display name, and local MCP project references. External MCP projects were not inspected or renamed.
- Updated the ignored local `compose.override.yaml` project name to match the tracked Compose files.
- Preserved the explicit `umaxica-edge-tunnel` network name and Tunnel configuration, sibling repository references, historical ADRs, plans and prior evidence.
- Existing unrelated work was retained. No deployment, push, container restart or recreation was performed.
- VPC transport removal is not part of this rename; its binding and Rails transport remain present and require a separate implementation change.

## Validation

- `git diff --check`: passed.
- Installed Vitest invoked directly: focused hostname / CSRF / package identity tests across all twenty units passed (145 tests).
- `EDGE_TRACKED_FILES="$(git ls-files)" node_modules/.bin/vitest run --dir test`: 662 assertions passed in twenty suites; the remaining architecture suite failed during collection because spawning `depcruise` returned `EPERM`.
- `pnpm exec intent list` failed before running Intent because the package-manager engine store operation lock was read-only. The installed `node_modules/.bin/intent` was used to list and load the execution-model and deployment skills instead; no replacement was downloaded.
- `pnpm install --offline --frozen-lockfile`, `pnpm run check`, `pnpm run build` and `pnpm run test:api` could not start for the same store-lock error. `check:size` was not reached because build could not start.
- `git remote set-url origin https://github.com/seahal/umaxica-apps-edge-zenith.git` failed because `.git/config` is read-only. The local origin still points to `umaxica-apps-edge-acme`; GitHub's rename was reported by the owner, not independently verified here.

## Existing documentation discrepancies

- README describes seventeen units and excludes the app/com/org apex Workers, while the checkout and ADR 027 include twenty units. This pre-existing description was retained.
- AGENTS describes no external observability vendor; three Core `.mcp.json` files contain Sentry project references. Only the local project-name portion of those references was updated; external availability is unverified.
