import { z } from "zod";

export const TaskStatus = z.enum(["todo", "in_progress", "done"]);
export const TaskPriority = z.enum(["low", "medium", "high"]);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  status: TaskStatus,
  priority: TaskPriority,
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskListSchema = z.object({
  data: z.array(TaskSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
  }),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
