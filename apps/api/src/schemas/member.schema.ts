import { z } from "zod";

export const MemberSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().nullable(),
  createdAt: z.string().datetime(),
});

export const CreateMemberSchema = MemberSchema.omit({
  id: true,
  createdAt: true,
});

export const MemberListSchema = z.object({
  data: z.array(MemberSchema),
});

export type Member = z.infer<typeof MemberSchema>;
export type CreateMember = z.infer<typeof CreateMemberSchema>;
