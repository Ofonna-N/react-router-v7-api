import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("projects", "routes/projects._index.tsx"),
    route("projects/:id", "routes/projects.$id.tsx"),
    route("projects/:id/tasks", "routes/projects.$id.tasks.tsx"),
    route("members", "routes/members._index.tsx"),
  ]),
] satisfies RouteConfig;
