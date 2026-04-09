import type { Member } from "../schemas/member.schema.js";
import type { Project } from "../schemas/project.schema.js";
import type { Task } from "../schemas/task.schema.js";

// Seed data so the app has something to show on first load

export const members = new Map<string, Member>([
  [
    "m-1",
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Alice Johnson",
      email: "alice@catalyst.dev",
      avatarUrl: null,
      createdAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  [
    "m-2",
    {
      id: "00000000-0000-0000-0000-000000000002",
      name: "Bob Smith",
      email: "bob@catalyst.dev",
      avatarUrl: null,
      createdAt: "2024-01-02T00:00:00.000Z",
    },
  ],
]);

export const projects = new Map<string, Project>([
  [
    "p-1",
    {
      id: "00000000-0000-0000-0001-000000000001",
      name: "Catalyst MVP",
      description: "The initial release of the Catalyst platform",
      status: "active",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
]);

export const tasks = new Map<string, Task>([
  [
    "t-1",
    {
      id: "00000000-0000-0000-0002-000000000001",
      projectId: "00000000-0000-0000-0001-000000000001",
      title: "Set up Hono API",
      description: "Scaffold the backend with OpenAPI spec generation",
      status: "done",
      priority: "high",
      assigneeId: "00000000-0000-0000-0000-000000000001",
      dueDate: null,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ],
  [
    "t-2",
    {
      id: "00000000-0000-0000-0002-000000000002",
      projectId: "00000000-0000-0000-0001-000000000001",
      title: "Integrate Orval",
      description: "Generate TanStack Query hooks from the OpenAPI spec",
      status: "in_progress",
      priority: "high",
      assigneeId: "00000000-0000-0000-0000-000000000002",
      dueDate: null,
      createdAt: "2024-01-02T00:00:00.000Z",
      updatedAt: "2024-01-02T00:00:00.000Z",
    },
  ],
  [
    "t-3",
    {
      id: "00000000-0000-0000-0002-000000000003",
      projectId: "00000000-0000-0000-0001-000000000001",
      title: "Build project dashboard",
      description: "Frontend view for listing projects and their task counts",
      status: "todo",
      priority: "medium",
      assigneeId: null,
      dueDate: null,
      createdAt: "2024-01-03T00:00:00.000Z",
      updatedAt: "2024-01-03T00:00:00.000Z",
    },
  ],
]);
