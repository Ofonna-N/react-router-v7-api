# Tech Debt

## Monorepo Tooling

Currently `apps/api` and `apps/web` are standalone projects wired manually.
The following should be added once the core is working end-to-end.

### pnpm Workspaces

- Add `pnpm-workspace.yaml` at the root
- Add a root `package.json` with shared dev dependencies (TypeScript, Prettier, ESLint)
- Move each app's shared dev deps to the root

### Turborepo

- Add `turbo.json` at the root with the following task pipeline:
  - `api#generate:spec` → dumps `openapi.json` from the live Hono app
  - `web#generate` → runs Orval against `../api/openapi.json`
  - `typecheck` → depends on `generate` (ensures hooks are fresh before type checking)
  - `dev` → starts both `api` and `web` concurrently from the root
- Replace manual `pnpm generate` calls in `apps/web` with `pnpm turbo generate` from root
- Add a shared `tsconfig.base.json` that both apps extend

### Goal

Single command from root replaces the current manual multi-step process:
```
# Current (manual)
cd apps/api && pnpm generate:spec
cd ../web && pnpm generate

# After Turborepo
pnpm turbo generate   # from root, handles ordering and caching automatically
```
