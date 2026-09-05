# AGENTS.md - dcyfr-build

## Project Overview

`dcyfr-build-hub` is a Next.js 16 / React 19 site for build-focused DCYFR workflows and resources.

## Architecture

- Routes and layouts: `app/`
- Shared UI: `components/`
- Shared logic: `lib/`
- Static/content data: `data/`

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Working Rules

- Stay within the current App Router and Tailwind setup.
- Extend existing sections and components before adding new structural layers.
