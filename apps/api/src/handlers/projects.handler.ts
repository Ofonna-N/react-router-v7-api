import { OpenAPIHono } from "@hono/zod-openapi";
import { randomUUID } from "crypto";
import { projects } from "../db/store.js";
import {
  listProjectsRoute,
  getProjectRoute,
  createProjectRoute,
  updateProjectRoute,
  deleteProjectRoute,
} from "../routes/projects.route.js";

export function registerProjectRoutes(app: OpenAPIHono) {
  app.openapi(listProjectsRoute, (c) => {
    return c.json({ data: Array.from(projects.values()) }, 200);
  });

  app.openapi(getProjectRoute, (c) => {
    const { id } = c.req.valid("param");
    const project = Array.from(projects.values()).find((p) => p.id === id);
    if (!project) {
      return c.json({ message: "Project not found" }, 404);
    }
    return c.json(project, 200);
  });

  app.openapi(createProjectRoute, (c) => {
    const body = c.req.valid("json");
    const now = new Date().toISOString();
    const project = {
      id: randomUUID(),
      ...body,
      description: body.description ?? null,
      status: body.status ?? "active",
      createdAt: now,
      updatedAt: now,
    };
    projects.set(project.id, project);
    return c.json(project, 201);
  });

  app.openapi(updateProjectRoute, (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const existing = Array.from(projects.values()).find((p) => p.id === id);
    if (!existing) {
      return c.json({ message: "Project not found" }, 404);
    }
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    projects.set(id, updated);
    return c.json(updated, 200);
  });

  app.openapi(deleteProjectRoute, (c) => {
    const { id } = c.req.valid("param");
    const existing = Array.from(projects.values()).find((p) => p.id === id);
    if (!existing) {
      return c.json({ message: "Project not found" }, 404);
    }
    projects.delete(id);
    return c.body(null, 204);
  });
}
