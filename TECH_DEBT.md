# Tech Debt

## Monorepo Tooling ✅ Complete

All items below have been implemented. Kept for reference.

### pnpm Workspaces ✅ Done

- Add `pnpm-workspace.yaml` at the root
- Add a root `package.json` with shared dev dependencies (TypeScript, Prettier, ESLint)
- Move each app's shared dev deps to the root

### Turborepo ✅ Done

- Add `turbo.json` at the root with the following task pipeline:
  - `api#generate:spec` → dumps `openapi.json` from the live Hono app
  - `web#generate` → runs Orval against `../api/openapi.json`
  - `typecheck` → depends on `generate` (ensures hooks are fresh before type checking)
  - `dev` → starts both `api` and `web` concurrently from the root
- Replace manual `pnpm generate` calls in `apps/web` with `pnpm turbo run generate` from root
- Add a shared `tsconfig.base.json` that both apps extend

### tsconfig.base.json ✅ Done

- Added `tsconfig.base.json` at the root
- Both `apps/api` and `apps/web` now extend it

### Goal

Single command from root replaces the current manual multi-step process:
```
# Previous (manual)
cd apps/api && pnpm generate:spec
cd ../web && pnpm generate

# After Turborepo
pnpm turbo run generate   # from root, handles ordering and caching automatically
```
