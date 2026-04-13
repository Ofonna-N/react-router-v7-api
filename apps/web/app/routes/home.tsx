import { Link } from "react-router";

const pipeline = [
  {
    step: "1",
    label: "Zod Schema",
    description: "Write validation schemas once",
    detail: "project.schema.ts",
    color: "bg-violet-50 border-violet-200 text-violet-700",
    badge: "bg-violet-100 text-violet-600",
  },
  {
    step: "2",
    label: "OpenAPI Spec",
    description: "Auto-generated from schemas",
    detail: "openapi.json",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    badge: "bg-blue-100 text-blue-600",
  },
  {
    step: "3",
    label: "Orval Codegen",
    description: "Type-safe hooks generated",
    detail: "projects.ts",
    color: "bg-cyan-50 border-cyan-200 text-cyan-700",
    badge: "bg-cyan-100 text-cyan-600",
  },
  {
    step: "4",
    label: "TanStack Query",
    description: "Data fetching in React",
    detail: "useGetProjects()",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-600",
  },
];

const stack = [
  { name: "Hono", description: "API framework" },
  { name: "Zod", description: "Schema validation" },
  { name: "OpenAPI 3.1", description: "Spec generation" },
  { name: "Orval", description: "Code generation" },
  { name: "React Router v7", description: "SPA routing" },
  { name: "TanStack Query", description: "Server state" },
  { name: "TypeScript", description: "End-to-end types" },
  { name: "Turborepo", description: "Pipeline automation" },
];

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Hero */}
      <div className="mb-14">
        <div className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-4 border border-blue-100">
          Portfolio project
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
          Catalyst
        </h1>
        <p className="text-lg text-gray-600 mb-2 max-w-xl">
          A type-safe project management system where a single Zod schema drives
          validation, API documentation, and React Query hooks — with zero drift
          between layers.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Hono · Zod · OpenAPI · Orval · TanStack Query · React Router v7
        </p>
        <div className="flex gap-3">
          <Link
            to="/projects"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
          >
            View Projects
          </Link>
          <Link
            to="/members"
            className="border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            View Members
          </Link>
        </div>
      </div>

      {/* Pipeline */}
      <div className="mb-14">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          How it works
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          {pipeline.map((item, i) => (
            <div
              key={item.step}
              className="flex sm:flex-col items-center gap-2 flex-1"
            >
              <div
                className={`flex-1 w-full rounded-lg border p-4 ${item.color}`}
              >
                <div
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.badge} inline-block mb-2`}
                >
                  Step {item.step}
                </div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                <p className="text-xs font-mono opacity-60 mt-2">
                  {item.detail}
                </p>
              </div>
              {i < pipeline.length - 1 && (
                <>
                  <span className="text-gray-300 text-lg font-light select-none sm:hidden">
                    ↓
                  </span>
                  <span className="text-gray-300 text-lg font-light select-none hidden sm:block">
                    →
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Change a schema field → re-run{" "}
          <code className="font-mono bg-gray-100 px-1 py-0.5 rounded">
            pnpm turbo run generate
          </code>{" "}
          → hooks update automatically.
        </p>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Tech stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stack.map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-gray-100 bg-white px-3 py-3 shadow-sm"
            >
              <p className="font-medium text-gray-900 text-sm">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
