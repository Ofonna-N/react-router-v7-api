import { z } from "zod";

export const ProjectStatus = z.enum(["active", "archived"]);

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  status: ProjectStatus,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const ProjectListSchema = z.object({
  data: z.array(ProjectSchema),
});

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
