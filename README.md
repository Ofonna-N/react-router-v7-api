# Catalyst

A type-safe project management system built as an experiment in **zero-drift API development**, where a single Zod schema is the source of truth for runtime validation, OpenAPI documentation, and fully-typed React Query hooks.

## The problem this solves

In a typical frontend/backend setup, the same data shape gets written three times:

1. A TypeScript interface on the frontend
2. Validation logic on the backend
3. API documentation in a spec file

These drift apart. A backend developer renames a field; the frontend type is wrong; the docs are stale. Nobody notices until runtime.

Catalyst collapses all three into one:

```
Zod Schema  →  OpenAPI 3.1 Spec  →  TanStack Query Hooks
(one file)     (auto-generated)      (auto-generated)
```

Change the schema, run one command, and the entire stack updates.

## Tech stack

| Layer | Technology | Role |
|-------|-----------|------|
| API framework | [Hono](https://hono.dev) + `@hono/zod-openapi` | Routes, validation, OpenAPI spec generation |
| Schema / types | [Zod](https://zod.dev) | Single source of truth for shapes and TypeScript types |
| Code generation | [Orval](https://orval.dev) | Reads OpenAPI spec, writes TanStack Query hooks |
| Frontend routing | [React Router v7](https://reactrouter.com) | SPA mode, loaders only for URL params, no SSR |
| Server state | [TanStack Query](https://tanstack.com/query) | All data fetching; loaders never touch the network |
| Monorepo | pnpm workspaces + [Turborepo](https://turbo.build) | Enforces `generate:spec → generate` pipeline order |

## How the pipeline works

**1. Define a Zod schema once**
```ts
// apps/api/src/schemas/project.schema.ts
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  status: z.enum(["active", "archived"]),
});

export type Project = z.infer<typeof ProjectSchema>; // ← type derived, not written
```

**2. Declare a route — schema becomes the contract**
```ts
// apps/api/src/routes/projects.route.ts
export const getProjectsRoute = createRoute({
  method: "get",
  path: "/projects",
  responses: {
    200: { content: { "application/json": { schema: z.array(ProjectSchema) } } },
  },
});
```

**3. Dump the spec to disk**
```bash
pnpm turbo run generate  # runs generate:spec → generate in order
```

`openapi.json` is committed to source control — it's the versioned contract between backend and frontend. Diff it in PRs to see exactly what changed in the API surface.

**4. Use the generated hook**
```tsx
// In any React component — no types to write, no fetch to wire
const { data, isLoading } = useGetProjects();
```

## Project structure

```
.
├── apps/
│   ├── api/                        # Hono backend
│   │   ├── src/
│   │   │   ├── schemas/            # Zod schemas (source of truth)
│   │   │   ├── routes/             # createRoute() definitions (shape only)
│   │   │   ├── handlers/           # Business logic, wired via app.openapi()
│   │   │   ├── db/store.ts         # In-memory data store
│   │   │   └── openapi/spec.ts     # Dumps spec to openapi.json
│   │   └── openapi.json            # Generated — committed as API contract
│   │
│   └── web/                        # React Router v7 SPA
│       ├── app/
│       │   ├── api/generated/      # Orval output — do not edit manually
│       │   ├── lib/
│       │   │   ├── fetch-client.ts # Custom Orval mutator (base URL, errors)
│       │   │   └── query-client.ts # TanStack Query config
│       │   └── routes/             # Pages consuming generated hooks
│       └── orval.config.ts         # Points Orval at openapi.json
│
├── turbo.json                      # generate:spec → generate dependency
└── pnpm-workspace.yaml
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/projects` | List all projects |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/:id` | Get a project |
| `PATCH` | `/projects/:id` | Update a project |
| `GET` | `/projects/:id/tasks` | List tasks for a project |
| `POST` | `/projects/:id/tasks` | Create a task |
| `GET` | `/members` | List all members |
| `GET` | `/openapi.json` | Live OpenAPI 3.1 spec |

## Running locally

Prerequisites: [pnpm](https://pnpm.io) and Node 20+

```bash
git clone <this-repo>
pnpm install
```

**Terminal 1 — API** (runs on `http://localhost:3000`)
```bash
pnpm --filter @catalyst/api dev
```

**Terminal 2 — Frontend** (runs on `http://localhost:5173`)
```bash
pnpm --filter @catalyst/web dev
```

## Regenerating hooks after a schema change

```bash
pnpm turbo run generate
```

Turborepo runs `generate:spec` (dumps `openapi.json`) in the API first, then `generate` (runs Orval) in the web. The order is enforced by the `dependsOn` declaration in `turbo.json`, it cannot run out of sequence.

For a detailed walkthrough of the full pipeline, see [HOW_IT_WORKS.md](./HOW_IT_WORKS.md).
