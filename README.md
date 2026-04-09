# Catalyst

A type-safe project management API experiment — built with Hono, Orval, React Router v7, and TanStack Query.

## Project structure

```
apps/
  api/   — Hono backend, serves OpenAPI spec at /openapi.json
  web/   — React Router v7 SPA, uses Orval-generated TanStack Query hooks
```

## Running locally

You need two terminals.

**Terminal 1 — API server**
```bash
cd apps/api
pnpm install
pnpm dev
# Running at http://localhost:3000
# Spec at  http://localhost:3000/openapi.json
```

**Terminal 2 — Frontend**
```bash
cd apps/web
pnpm install
pnpm dev
# Running at http://localhost:5173
```

## The generation pipeline (run after any backend API change)

```bash
# Step 1: regenerate openapi.json from the live Hono app
cd apps/api
pnpm generate:spec

# Step 2: regenerate TanStack Query hooks from the new spec
cd apps/web
pnpm generate
```

See [HOW_IT_WORKS.md](./HOW_IT_WORKS.md) for a step-by-step explanation of the full pipeline.

## Tech debt

See [TECH_DEBT.md](./TECH_DEBT.md) for planned monorepo tooling (pnpm workspaces + Turborepo).
