# dcyfr-build

Hub for build-focused DCYFR workflows — cost estimator and templates — live at **[dcyfr.build](https://dcyfr.build)**.

`dcyfr-build-hub` is a Next.js 16 / React 19 site for build-focused DCYFR workflows and resources. It is part of the dcyfr-labs site family alongside [dcyfr-io](https://github.com/dcyfr-labs/dcyfr-io), [dcyfr-app](https://github.com/dcyfr-labs/dcyfr-app), [dcyfr-bot](https://github.com/dcyfr-labs/dcyfr-bot), [dcyfr-codes](https://github.com/dcyfr-labs/dcyfr-codes), [dcyfr-tech](https://github.com/dcyfr-labs/dcyfr-tech), and [dcyfr-work](https://github.com/dcyfr-labs/dcyfr-work).

## Stack

- Next.js 16 (App Router) / React 19 / Tailwind CSS
- shadcn primitives from the `@dcyfr-labs` registry (`registry.dcyfr.ai`); shared chrome (nav, footer, page shell, theme switcher/provider) in [`components/chrome/`](components/chrome/)
- Radix UI primitives + sonner toasts
- Playwright for e2e and visual-regression snapshots ([`e2e/`](e2e/README.md))

## Development

```sh
npm install
npm run dev        # http://localhost:3305
```

| Command | What it does |
|---|---|
| `npm run dev` / `npm run start` | Dev / production server on port **3305** |
| `npm run build` | Production build |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm run test:e2e` (`:ui`) | Playwright e2e suite |
| `npm run test:snapshots` (`:update`) | Visual-regression snapshots (chromium) |

## Routes

- `/` — hub landing page
- `/cost-estimator` — interactive build-cost estimator
- `/templates`, `/templates/[slug]` — build template catalog and detail pages

Feature data (templates, estimator inputs) lives in `data/`.

## Environment variables

None are required to run locally; every variable below is optional.

| Variable | Use |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Client-side Sentry reporting (`instrumentation-client.ts`) |
| `SENTRY_DSN` | Server and edge Sentry reporting; falls back to `NEXT_PUBLIC_SENTRY_DSN` |
| `SENTRY_ORG` / `SENTRY_PROJECT` | Build-time source-map upload; default to `dcyfr-labs` / `dcyfr-build` (`next.config.ts`) |
| `INDEXNOW_KEY` | Served at `/indexnow.txt` for IndexNow; the route returns 404 when unset |

## Design-token & scaffold contract

This site follows the `dcyfr-site-scaffold` contract: colors, spacing, radii, and typography resolve via CSS variables — no hardcoded design tokens. Local ESLint rules in `eslint-local-rules/` enforce this and the `design-tokens.yml` workflow gates every PR. From the workspace root, `npm run audit:sites` checks scaffold compliance across the site family.

## CI

- `ci.yml` — lint, typecheck, build
- `codeql.yml` / `semgrep.yml` — static security analysis
- `design-tokens.yml` — design-token + scaffold gate
- `visual-regression.yml` — Playwright snapshots
- `dependabot-auto-merge.yml` — dependency hygiene

## Deployment

Deployed on Vercel from `main`, with hardened security headers via `vercel.json`.

## Further docs

- [`AGENTS.md`](AGENTS.md) — agent conventions and project structure
- [`components/chrome/`](components/chrome/) — shared chrome primitives
- [`e2e/README.md`](e2e/README.md) — test suite notes
