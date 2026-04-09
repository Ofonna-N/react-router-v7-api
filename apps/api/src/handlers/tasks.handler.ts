import { OpenAPIHono } from "@hono/zod-openapi";
import { randomUUID } from "crypto";
import { projects, tasks } from "../db/store.js";
import {
  listTasksRoute,
  getTaskRoute,
  createTaskRoute,
  updateTaskRoute,
  deleteTaskRoute,
} from "../routes/tasks.route.js";

export function registerTaskRoutes(app: OpenAPIHono) {
  app.openapi(listTasksRoute, (c) => {
    const { projectId } = c.req.valid("param");
    const { status, page, pageSize } = c.req.valid("query");

    const projectExists = Array.from(projects.values()).some(
      (p) => p.id === projectId
    );
    if (!projectExists) {
      return c.json({ message: "Project not found" }, 404);
    }

    let projectTasks = Array.from(tasks.values()).filter(
      (t) => t.projectId === projectId
    );

    if (status) {
      projectTasks = projectTasks.filter((t) => t.status === status);
    }

    const total = projectTasks.length;
    const totalPages = Math.ceil(total / pageSize);
    const data = projectTasks.slice((page - 1) * pageSize, page * pageSize);

    return c.json({ data, meta: { total, page, pageSize, totalPages } }, 200);
  });

  app.openapi(getTaskRoute, (c) => {
    const { projectId, taskId } = c.req.valid("param");
    const task = Array.from(tasks.values()).find(
      (t) => t.id === taskId && t.projectId === projectId
    );
    if (!task) {
      return c.json({ message: "Task not found" }, 404);
    }
    return c.json(task, 200);
  });

  app.openapi(createTaskRoute, (c) => {
    const { projectId } = c.req.valid("param");
    const body = c.req.valid("json");

    const projectExists = Array.from(projects.values()).some(
      (p) => p.id === projectId
    );
    if (!projectExists) {
      return c.json({ message: "Project not found" }, 404);
    }

    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      projectId,
      ...body,
      description: body.description ?? null,
      assigneeId: body.assigneeId ?? null,
      dueDate: body.dueDate ?? null,
      status: body.status ?? "todo",
      priority: body.priority ?? "medium",
      createdAt: now,
      updatedAt: now,
    };
    tasks.set(task.id, task);
    return c.json(task, 201);
  });

  app.openapi(updateTaskRoute, (c) => {
    const { projectId, taskId } = c.req.valid("param");
    const body = c.req.valid("json");

    const existing = Array.from(tasks.values()).find(
      (t) => t.id === taskId && t.projectId === projectId
    );
    if (!existing) {
      return c.json({ message: "Task not found" }, 404);
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    tasks.set(taskId, updated);
    return c.json(updated, 200);
  });

  app.openapi(deleteTaskRoute, (c) => {
    const { projectId, taskId } = c.req.valid("param");
    const existing = Array.from(tasks.values()).find(
      (t) => t.id === taskId && t.projectId === projectId
    );
    if (!existing) {
      return c.json({ message: "Task not found" }, 404);
    }
    tasks.delete(taskId);
    return c.body(null, 204);
  });
}
