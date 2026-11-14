# Zenith apex Workers Builds triggers

Supersedes the remote blocker in `2026-11-14-zenith-workers-builds-preparation.md`
and the Worker name in `2026-11-14-zenith-app-apex-worker-name.md`.

## Names

- Owner renamed the Cloudflare Workers in the dashboard; `cf workers scripts search --name zenith`
  then listed `umaxica-apps-edge-zenith-{app,com,org,net,dev}` (tags `7f3c696e…`, `d1798418…`,
  `44965384…`, `4d8981e7…`, `7be9288d…`). Renaming kept tags and custom domains.
- `name` in each `<tld>/apex/wrangler.jsonc`, `APEX_WORKER_NAME`, Vite environment keys, CSRF /
  host-policy tests and `test/apex-units.test.ts` changed to match. Package names unchanged.

## Triggers (applied with `cf builds triggers create|update`, cf CLI under node 26.10.0)

- Repo connection `e5cfb8bc…` (`seahal/umaxica-apps-edge-zenith`), build token `de141651…`.
- Per Worker: production (`main`, `deploy:ci`) and preview (all branches except `main`,
  `upload:ci`); root `/`, build `pnpm --dir <tld>/apex run build`, paths `<tld>/apex/*` and
  `pnpm-lock.yaml`, build caching on. `cf builds triggers list` showed all ten on this repository.
- Old dev/net triggers on `umaxica-apps-edge` were deleted by the owner in the dashboard.

## Validation

- `pnpm run lint`, `typecheck`, `test`: passed. `vite build` for all five apex units: passed.
- `format:check` fails only on `plans/2026-11-12-split-edge-into-three-repositories.md`, untouched.
- No build had run when this was written; whether `<tld>/apex/*` matches nested paths is unverified.
