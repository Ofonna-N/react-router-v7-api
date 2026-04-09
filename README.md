# Catalyst

A type-safe project management API experiment — built with Hono, Orval, React Router v7, and TanStack Query.

## Project structure

```
apps/
  api/   — Hono backend, serves OpenAPI spec at /openapi.json
  web/   — React Router v7 SPA, uses Orval-generated TanStack Query hooks
```

## Running locally

**Terminal 1 — API**
```bash
pnpm --filter @catalyst/api dev
```

**Terminal 2 — Frontend**
```bash
pnpm --filter @catalyst/web dev
```

## Regenerate API hooks (after any backend change)

```bash
pnpm turbo run generate
```
This runs `generate:spec` in the API first, then `generate` in the web automatically.

See [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for a step-by-step explanation of the full pipeline.

## Tech debt

See [TECH_DEBT.md](./TECH_DEBT.md) for planned monorepo tooling (pnpm workspaces + Turborepo).
