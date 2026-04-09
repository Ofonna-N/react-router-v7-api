import { createRoute, z } from "@hono/zod-openapi";
import {
  TaskSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskListSchema,
  TaskStatus,
} from "../schemas/task.schema.js";
import { ErrorSchema } from "../schemas/error.schema.js";

export const listTasksRoute = createRoute({
  method: "get",
  path: "/projects/{projectId}/tasks",
  tags: ["Tasks"],
  summary: "List tasks for a project",
  request: {
    params: z.object({ projectId: z.string().uuid() }),
    query: z.object({
      status: TaskStatus.optional(),
      page: z.coerce.number().min(1).default(1),
      pageSize: z.coerce.number().min(1).max(100).default(20),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: TaskListSchema } },
      description: "Paginated list of tasks",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Project not found",
    },
  },
});

export const getTaskRoute = createRoute({
  method: "get",
  path: "/projects/{projectId}/tasks/{taskId}",
  tags: ["Tasks"],
  summary: "Get a task by ID",
  request: {
    params: z.object({
      projectId: z.string().uuid(),
      taskId: z.string().uuid(),
    }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: TaskSchema } },
      description: "Task found",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Task not found",
    },
  },
});

export const createTaskRoute = createRoute({
  method: "post",
  path: "/projects/{projectId}/tasks",
  tags: ["Tasks"],
  summary: "Create a task in a project",
  request: {
    params: z.object({ projectId: z.string().uuid() }),
    body: {
      content: {
        "application/json": {
          schema: CreateTaskSchema.omit({ projectId: true }),
        },
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: TaskSchema } },
      description: "Task created",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Project not found",
    },
  },
});

export const updateTaskRoute = createRoute({
  method: "patch",
  path: "/projects/{projectId}/tasks/{taskId}",
  tags: ["Tasks"],
  summary: "Update a task",
  request: {
    params: z.object({
      projectId: z.string().uuid(),
      taskId: z.string().uuid(),
    }),
    body: {
      content: { "application/json": { schema: UpdateTaskSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: TaskSchema } },
      description: "Task updated",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Task not found",
    },
  },
});

export const deleteTaskRoute = createRoute({
  method: "delete",
  path: "/projects/{projectId}/tasks/{taskId}",
  tags: ["Tasks"],
  summary: "Delete a task",
  request: {
    params: z.object({
      projectId: z.string().uuid(),
      taskId: z.string().uuid(),
    }),
  },
  responses: {
    204: {
      description: "Task deleted",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Task not found",
    },
  },
});
