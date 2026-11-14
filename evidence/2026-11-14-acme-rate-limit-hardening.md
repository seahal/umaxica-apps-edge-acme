# Acme apex rate-limit hardening

Date: 2026-11-14
Base commit: f3552e95

## Scope and result

Updated the five Hono apex units (app/com/org/net/dev). Requests without a
nonempty CF-Connecting-IP now use the constant `no-ip` bucket rather than an
attacker-selected pathname. This prevents creating new fallback budgets by
varying the URL. Unattributable callers share a budget and can exhaust it for
one another; normal client-IP keys are unchanged. This is a targeted fix,
not certification of the complete application security posture.

Routing remains unchanged: app/com/org redirect to regional sites; net/dev
render homepages. Worker names, routes, bindings and secrets were not changed.
ADR 010 records the apex-specific amendment; TanStack units retain their older
per-path implementation. Existing README text claiming only two apex units
and no app/com/org ownership conflicts with the current five-unit code.

## Executed validation

The normal pnpm launcher failed opening its engine-store lock on a read-only
filesystem. `pnpm with current` used installed pnpm 12.15.0, without fetching a
replacement. Installed Node was 26.12.0 versus requested 26.13.1.

- `pnpm exec intent list`: failed at engine-store lock; retried successfully
  as `pnpm with current exec intent list`. No matching Hono skill was listed.
- `pnpm install` and `pnpm with current install --offline --frozen-lockfile`:
  blocked by read-only store-operation lock. Dependencies were not refreshed.
- `pnpm with current --dir <unit> run check`: PASS for each of the five units,
  including format, lint, typed lint, generated bindings, TypeScript, Knip and
  unit tests. app/com/org each passed 117 tests; net/dev each passed 97 (545 total).
- `pnpm with current --dir <unit> run build`: PASS for all five units.
  Initial app build emitted a read-only Wrangler log-path error while exiting
  successfully; other builds used WRANGLER_LOG_PATH under /tmp.
- `pnpm with current --dir <unit> run check:size`: PASS for all five;
  app/org 53.61 kB, com 53.60 kB, net 53.73 kB, dev 53.71 kB gzipped;
  limit 59 kB each.
- `pnpm with current run check`: FAIL at root formatting of the unchanged
  `plans/2026-11-12-split-edge-into-three-repositories.md`; subsequent root gates
  were not reached. The five unit checks above ran separately.
- `pnpm with current --dir app/apex run test:api`: BLOCKED before HTTP
  assertions by `listen EPERM` on 127.0.0.1. Other units were not attempted
  after this environment-level failure. Browser tests were not run.
- `git diff --check`: PASS before this evidence record was added.
- `wrangler whoami` via installed pnpm: FAIL; stored authentication expired
  and Cloudflare auth server could not be reached. Credentials were unchanged.

## Release status

No upload, deploy, DNS or domain cutover was attempted. Release remains blocked
on dependency installation, remaining repository checks, real-server HTTP
validation and working Cloudflare authentication/network access. Current live
Workers, deployment versions and hostname ownership have not been verified.

## Subsequent operator deployment report

The owner subsequently reported completing deployment of all five Workers
(app/com/org/net/dev) from their terminal. This is operator-reported success;
Codex has not observed deployment command output or version identifiers.

After that report, Codex attempted HEAD requests to all five public apex hosts
using Python urllib. All five failed with `Temporary failure in name resolution`
before reaching an HTTP server. These failures describe this execution
environment, not the availability of the deployed Workers. Earlier checks in
this record remain the pre-deployment local results. Live revision, HTTP
contracts and custom-domain ownership remain unverified; configured routes
were not changed by this work.
