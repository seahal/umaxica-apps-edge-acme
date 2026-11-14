# Zenith Workers Builds preparation

## Verified

- GitHub connector confirmed `seahal/umaxica-apps-edge-zenith` exists, is public, and has default branch `main` (repository id `1455489407`).
- The target source configuration is `app/apex/wrangler.jsonc`, Worker name `umaxica-apps-edge-zenith`.
- Existing `deploy:ci` builds and deploys, while `upload:ci` builds and uploads a version. Both clear `CLOUDFLARE_ENV` for Wrangler.
- GitHub Actions currently provides CI; the existing workflow describes Workers Builds as the deployment system. No parallel GitHub Actions deployment workflow was added.

## Local changes

- Corrected the stale Vite environment name from `umaxica_apps_edge_app_apex` to `umaxica_apps_edge_zenith`, so Worker source-map configuration targets the renamed build environment.
- Documented the concrete GitHub repository, branch, root directory and production / non-production commands in README. These are intended settings, not an applied remote configuration.
- Preserved earlier Worker hostname changes and existing Tunnel settings.

## Validation actually performed

- `CLOUDFLARE_ENV= ../../node_modules/.bin/vite build` from `app/apex`: exit 0, generated `dist/umaxica_apps_edge_zenith/wrangler.json` and Worker source map. Wrangler reported a read-only log-directory error; build artifacts were still generated.
- `WRANGLER_LOG_PATH=/tmp/zenith-cd-wrangler.log CLOUDFLARE_ENV= WRANGLER_SEND_METRICS=false ../../node_modules/.bin/wrangler deploy --dry-run --outdir /tmp/zenith-cd-dry-run`: exit 0, used the generated config redirect, production `EDGE_ENV`, 193.40 KiB total upload / 52.55 KiB gzip. Nothing was deployed.
- Installed `size-limit` invoked directly in `app/apex`: 53.61 kB gzip, below 59 kB limit.
- `git diff --check` and formatting checks: passed.
- Required `pnpm run check` and per-unit HTTP tests could not start because the package-manager store operation lock was read-only. Direct binary checks do not constitute a passing full repository check or HTTP verification.

## Remote blocker

- Browser inventory failed: browser access host unavailable. No Cloudflare dashboard page could be opened or read.
- An existing Wrangler OAuth credential was present; no credential value was printed or changed. An authenticated read-only Cloudflare accounts request failed with DNS resolution error before an HTTP response.
- Plugin discovery returned no suitable account-management integration for Cloudflare.
- Therefore the current Cloudflare build connection, token selection and build settings could not be inspected or modified. No remote connection, CD update, build trigger, deployment or token creation was performed.

References consulted: Cloudflare Workers Builds configuration, API reference and Git integration documentation, retrieved through the Cloudflare documentation connector.
