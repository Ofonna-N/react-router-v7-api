# How the API Generation Pipeline Works

This document explains the full flow from backend schema to frontend hooks,
step by step — so you can understand, recreate, and extend it yourself.

---

## The Big Picture

```
Backend (Hono)                     Frontend (React Router v7)
──────────────                     ──────────────────────────
Zod schema                         React component
    ↓                                  ↑
Route definition                   Orval-generated hook (useGetProjects)
    ↓                                  ↑
Hono registers route               Orval reads the spec
    ↓                                  ↑
app.doc() generates ──────────────→ openapi.json
openapi.json
```

One file (`openapi.json`) is the contract between backend and frontend.
Changing the backend without updating it breaks nothing on the frontend —
until you regenerate, which is intentional and visible.

---

## Step 1 — Define a Zod Schema (Backend)

Every piece of data starts here. Zod is a TypeScript-first validation library.
You define the shape of your data once, and get both runtime validation
and TypeScript types for free.

**File:** `apps/api/src/schemas/project.schema.ts`

```typescript
import { z } from "zod";

// Define the shape of a Project
export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  status: z.enum(["active", "archived"]),
  createdAt: z.string().datetime(),
});

// Derive a TypeScript type from the schema — no duplication
export type Project = z.infer<typeof ProjectSchema>;
// Result: { id: string; name: string; status: "active" | "archived"; createdAt: string }

// Create input schemas by transforming the base schema
export const CreateProjectSchema = ProjectSchema.omit({ id: true, createdAt: true });
```

**Why this matters:** The same `ProjectSchema` object is used by Hono to validate
incoming requests at runtime AND to generate the OpenAPI spec. It cannot get out
of sync with itself.

---

## Step 2 — Define a Route (Backend)

A route definition describes a single HTTP endpoint: its method, path, what
inputs it accepts, and what responses it returns. This is NOT the handler
(business logic) — it is the contract.

**File:** `apps/api/src/routes/projects.route.ts`

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import { ProjectSchema, CreateProjectSchema, ProjectListSchema } from "../schemas/project.schema.ts";

export const listProjectsRoute = createRoute({
  method: "get",
  path: "/projects",
  tags: ["Projects"],           // groups this endpoint in the generated spec
  responses: {
    200: {
      content: { "application/json": { schema: ProjectListSchema } },
      description: "List of all projects",
    },
  },
});

export const createProjectRoute = createRoute({
  method: "post",
  path: "/projects",
  tags: ["Projects"],
  request: {
    body: {
      content: { "application/json": { schema: CreateProjectSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: ProjectSchema } },
      description: "Project created",
    },
  },
});
```

**Key concept:** `createRoute` is typed — if your handler returns data that
doesn't match the schema in `responses`, TypeScript will error at compile time.

---

## Step 3 — Write the Handler (Backend)

The handler is where the actual work happens. Hono's `app.openapi()` connects
a route definition to its handler, and enforces the types from that definition.

**File:** `apps/api/src/handlers/projects.handler.ts`

```typescript
import { OpenAPIHono } from "@hono/zod-openapi";
import { listProjectsRoute, createProjectRoute } from "../routes/projects.route.ts";
import { projects } from "../db/store.ts";

export function registerProjectRoutes(app: OpenAPIHono) {
  app.openapi(listProjectsRoute, (c) => {
    // c.req.valid() gives you the validated, typed request data
    // For this route, no inputs — just return all projects
    return c.json({ data: Array.from(projects.values()) }, 200);
    // TypeScript error if the response shape doesn't match ProjectListSchema
  });

  app.openapi(createProjectRoute, (c) => {
    const body = c.req.valid("json");
    // body is typed as CreateProject — TypeScript knows its shape
    const project = { id: randomUUID(), ...body, createdAt: new Date().toISOString() };
    projects.set(project.id, project);
    return c.json(project, 201);
  });
}
```

---

## Step 4 — Register Routes and Expose the Spec (Backend)

The `OpenAPIHono` instance collects all registered routes and can generate
an OpenAPI 3.1 document from them on demand.

**File:** `apps/api/src/app.ts`

```typescript
import { OpenAPIHono } from "@hono/zod-openapi";
import { registerProjectRoutes } from "./handlers/projects.handler.ts";

export const app = new OpenAPIHono();

registerProjectRoutes(app);  // registers GET /projects, POST /projects

// This endpoint serves the generated spec as JSON
// Visit http://localhost:3000/openapi.json to see it
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: { title: "Catalyst API", version: "1.0.0" },
});
```

---

## Step 5 — Dump the Spec to a File

While the spec is served live at `/openapi.json`, Orval needs a file to read
during code generation (so it doesn't require the server to be running).
The spec script exports the same document to disk.

**File:** `apps/api/src/openapi/spec.ts`
**Run:** `pnpm generate:spec` from `apps/api/`

```typescript
import { writeFileSync } from "fs";
import { app } from "../app.ts";

const spec = app.getOpenAPI31Document({ openapi: "3.1.0", info: { ... } });
writeFileSync("./openapi.json", JSON.stringify(spec, null, 2));
```

**Output:** `apps/api/openapi.json`

Open this file and study it — it describes every endpoint, parameter,
request body, and response shape in a standardised format that any
OpenAPI-compatible tool can read.

---

## Step 6 — Configure Orval (Frontend)

Orval is a code generator that reads an OpenAPI spec and writes TypeScript
files. It lives in the frontend's `devDependencies` and runs as a CLI command.

**File:** `apps/web/orval.config.ts`

```typescript
import { defineConfig } from "orval";

export default defineConfig({
  catalyst: {
    input: {
      target: "../api/openapi.json",  // where to find the spec
    },
    output: {
      mode: "tags-split",    // one output file per OpenAPI tag (Projects, Tasks, Members)
      target: "app/api/generated",
      client: "react-query", // generate TanStack Query hooks, not plain fetch functions
      httpClient: "fetch",   // use native fetch (not axios)
      override: {
        mutator: {
          // Every generated hook uses this function to make HTTP calls
          // This is where you control base URL, auth headers, error handling
          path: "app/lib/fetch-client.ts",
          name: "fetchClient",
        },
      },
    },
  },
});
```

**Run:** `pnpm generate` from `apps/web/`

---

## Step 7 — Understand the Generated Output

After running `pnpm generate`, Orval writes files into `app/api/generated/`.
One file per tag. Open `app/api/generated/projects.ts` and you will see:

```typescript
// AUTO-GENERATED — DO NOT EDIT MANUALLY

// TypeScript types derived from the OpenAPI spec
export type Project = {
  id: string;
  name: string;
  status: "active" | "archived";
  createdAt: string;
};

// The query key factory — used to identify this query in TanStack Query's cache
export const getGetProjectsQueryKey = () => ["/projects"] as const;

// The actual TanStack Query hook — this is what you use in components
export const useGetProjects = (
  options?: UseQueryOptions<ProjectList, ApiError>
): UseQueryResult<ProjectList, ApiError> => {
  return useQuery({
    queryKey: getGetProjectsQueryKey(),
    queryFn: ({ signal }) => fetchClient<ProjectList>("/projects", { signal }),
    ...options,
  });
};

// Mutation hook for POST /projects
export const useCreateProject = (
  options?: UseMutationOptions<Project, ApiError, CreateProject>
) => {
  return useMutation({
    mutationFn: (body: CreateProject) =>
      fetchClient<Project>("/projects", { method: "POST", body: JSON.stringify(body) }),
    ...options,
  });
};
```

**Key things to notice:**
- `Project` type matches the Zod schema on the backend — same shape, derived from the spec
- `useGetProjects` is a standard TanStack Query hook — you can pass all the usual options
- `fetchClient` is your custom function from `app/lib/fetch-client.ts`
- The query key (`["/projects"]`) is what TanStack Query uses for caching and invalidation

---

## Step 8 — Use the Hook in a Component

```tsx
// app/routes/projects._index.tsx
import { useGetProjects } from "../api/generated/projects";
import { useCreateProject } from "../api/generated/projects";
import { queryClient } from "../lib/query-client";

export default function ProjectsPage() {
  // useGetProjects is the generated hook — fully typed
  const { data, isLoading, error } = useGetProjects();

  const { mutate: createProject, isPending } = useCreateProject({
    onSuccess: () => {
      // Tell TanStack Query to re-fetch the projects list
      queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.data.map((project) => (
        // project.name, project.status etc. are all typed — IDE autocompletes them
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}
```

---

## Step 9 — Automate the Pipeline with Turborepo

The manual two-step workflow has one risk: if you change the backend and forget
to regenerate, the frontend types silently go stale. Turborepo fixes this by
making the generation order a declared dependency — `generate` in the web
*cannot* run before `generate:spec` in the API.

**File:** `turbo.json` (root)

```json
{
  "tasks": {
    "generate:spec": {
      "outputs": ["openapi.json"]
    },
    "generate": {
      "dependsOn": ["@catalyst/api#generate:spec"],
      "inputs": ["../api/openapi.json", "orval.config.ts"],
      "outputs": ["app/api/generated/**"]
    }
  }
}
```

**What each field does:**

| Field | Purpose |
|---|---|
| `dependsOn: ["@catalyst/api#generate:spec"]` | Turbo runs `generate:spec` in the API first, always |
| `inputs` | Turbo's cache key — only re-runs `generate` if these files changed |
| `outputs` | What gets cached — restored instantly on cache hit |

**Run from the repo root:**

```bash
pnpm turbo run generate
```

Turbo resolves the dependency graph, runs `generate:spec` in `apps/api/` first
(writing `openapi.json`), then runs `generate` in `apps/web/` against the fresh
spec. Both steps are cached — if nothing changed, both are skipped entirely.

**Why `pnpm turbo run generate` and not `pnpm turbo generate`?**

Turborepo has a built-in subcommand called `generate` (for scaffolding new
packages). Running `pnpm turbo generate` triggers that instead of your task.
Always use `pnpm turbo run <taskName>` to explicitly run a pipeline task.

---

## The Manual Workflow (without Turborepo)

For reference, here is what the pipeline looks like without Turborepo — this
is the friction that motivated adding it:

```bash
# Step 1: from apps/api/
pnpm generate:spec

# Step 2: from apps/web/
pnpm generate
```

The problem: nothing enforces the order or reminds you to run both.
If you skip step 1, Orval regenerates hooks from a stale spec with no warning.

---

## Recreating This From Scratch

To rebuild this pipeline yourself in a new project:

1. `pnpm add hono @hono/zod-openapi @hono/node-server zod` in your backend
2. Define your data shapes as Zod schemas
3. Use `createRoute()` to describe each endpoint
4. Use `app.openapi(route, handler)` to register them
5. Call `app.doc("/openapi.json", { ... })` to expose the spec
6. Run `app.getOpenAPI31Document()` and write the output to a `.json` file
7. In your frontend: `pnpm add -D orval` and create `orval.config.ts`
8. Point `input.target` at the `.json` file from step 6
9. Run `npx orval` — inspect what gets generated
10. Import the generated hooks in your components

The spec file is the only thing connecting steps 1–6 to steps 7–10.
Everything on both sides is independently valid TypeScript.
