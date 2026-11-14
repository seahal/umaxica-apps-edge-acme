# App apex Worker name alignment

The owner reported renaming the Cloudflare Worker from
`umaxica-apps-edge-app-apex` to `umaxica-apps-edge-zenith`.

- Changed `app/apex/wrangler.jsonc` and its hostname / CSRF policy to use the exact Worker name `umaxica-apps-edge-zenith`, replacing the earlier local name `umaxica-apps-edge-zenith-app-apex`.
- Updated the repository invariant for this unit and checked acceptance of `umaxica-apps-edge-zenith.umaxica.workers.dev`, with rejection of both former Worker hostnames.
- Kept the unique workspace package name `umaxica-apps-edge-zenith-app-apex`; package identity is independent of Cloudflare Worker identity.
- Preserved `workers_dev: false`, custom domains, preview URLs, Tunnel and VPC configuration. No deployment or external changes were performed; live availability was not verified.

## Validation

- Installed Vitest, invoked directly in `app/apex`: 19 suites, 117 tests passed.
- `EDGE_TRACKED_FILES="$(git ls-files)" node_modules/.bin/vitest run --dir test test/apex-units.test.ts`: 8 tests passed.
- Formatting and `git diff --check`: passed.
- `pnpm exec intent list` could not start due to a read-only package-manager store operation lock. The installed `node_modules/.bin/intent list` ran successfully; no listed TanStack skill applies to this Hono Worker name correction.
- `pnpm install --offline --frozen-lockfile` completed; subsequent pnpm executions still failed with `ERR_PNPM_STORE_DIR_OPEN_OPERATION_LOCK`.
- Required `pnpm run check`, per-unit build / size and HTTP checks were attempted but could not start because of the same store lock. No passing full-check, build or HTTP claim is made.
