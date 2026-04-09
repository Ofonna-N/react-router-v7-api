import { createRoute, z } from "@hono/zod-openapi";
import {
  ProjectSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  ProjectListSchema,
} from "../schemas/project.schema.js";
import { ErrorSchema } from "../schemas/error.schema.js";

export const listProjectsRoute = createRoute({
  method: "get",
  path: "/projects",
  tags: ["Projects"],
  summary: "List all projects",
  responses: {
    200: {
      content: { "application/json": { schema: ProjectListSchema } },
      description: "List of all projects",
    },
  },
});

export const getProjectRoute = createRoute({
  method: "get",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Get a project by ID",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: ProjectSchema } },
      description: "Project found",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Project not found",
    },
  },
});

export const createProjectRoute = createRoute({
  method: "post",
  path: "/projects",
  tags: ["Projects"],
  summary: "Create a new project",
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

export const updateProjectRoute = createRoute({
  method: "patch",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Update a project",
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { "application/json": { schema: UpdateProjectSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: ProjectSchema } },
      description: "Project updated",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Project not found",
    },
  },
});

export const deleteProjectRoute = createRoute({
  method: "delete",
  path: "/projects/{id}",
  tags: ["Projects"],
  summary: "Delete a project",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: {
      description: "Project deleted",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Project not found",
    },
  },
});
