# Acme contrast and custom domains

## Changes

- Fixed all five apex stylesheets: unlayered light canvas defaults overrode
  dark canvas values inside `@layer base`, while dark foreground utilities
  still applied. Moved the defaults into the same base layer as overrides.
- Added per-unit Playwright body-text contrast tests for light/dark OS schemes
  and system/light/dark document themes (six cases per unit, threshold 4.5).
- Each production Wrangler config declares its own `umaxica.<tld>` custom
  domain and disables `workers_dev` and `preview_urls`. Named development/test
  environments retain empty routes. There is no named staging environment
  in these configs; no new staging hostname was invented.
- Updated the repository apex ownership invariant and ADR 027 with the new
  owner-directed configuration policy. Older empty-route instructions in
  ADR 027 and README are historical conflicts with this new direction; the
  amendment supersedes ADR 027's empty-production-route rule.

## Validation performed

Used installed pnpm via `pnpm with current` (12.15.0) because the normal engine
launcher cannot write its store lock. Node 26.12.0 differs from requested
26.13.1. Existing dependency installation remains unchanged. Intent list was
retrieved from installed dependencies; no matching Hono skill was available.

- Five per-unit `run check` commands passed after correcting lint issues in
  the new test: formatting, lint, typed lint, generated bindings, typecheck,
  Knip and unit tests (117 each app/com/org; 97 each net/dev, 545 total).
- Five production `run build` commands passed.
- Five `run check:size` commands passed (each below the 59 kB gzip budget).
- `run test:repo`: 20 suites passed, 662 assertions passed; one suite could
  not initialize because spawning depcruise failed with EPERM. The updated
  apex ownership suite passed.
- Root `run check` stopped at formatting in the unchanged split plan
  `plans/2026-11-12-split-edge-into-three-repositories.md`.
- NET `playwright test e2e/contrast.spec.ts`: server could not start; browser
  assertions not reached. NET `run test:api`: server startup failed with
  `listen EPERM` on 127.0.0.1. No visual or live contrast pass is claimed.

## Public rollout

No deployment or DNS/Tunnel modification was performed in this change.
The custom-domain configuration takes effect on a subsequent deployment.
Current hostname ownership is unverified. Existing Tunnel hostnames or DNS
records may conflict and must be reconciled before completing the cutover.
Cloudflare-provided production/version URLs are configured off; this is not
proof that already deployed URLs have been disabled remotely.

References: Cloudflare Workers custom domains and workers.dev documentation,
retrieved 2026-11-14:
https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
https://developers.cloudflare.com/workers/configuration/routing/workers-dev/

## Owner correction: enable version previews

The owner subsequently requested `preview_urls: true` in all five apex
configs. Updated the configs and ownership invariant; `workers_dev: false`
and custom-domain routes remain unchanged. The earlier preview-disable
statements above describe the superseded configuration.

`pnpm with current exec vitest run test/apex-units.test.ts` passed all eight
tests after this correction. No deployment was performed.
