import { createRoute, z } from "@hono/zod-openapi";
import { MemberSchema, CreateMemberSchema, MemberListSchema } from "../schemas/member.schema.js";
import { ErrorSchema } from "../schemas/error.schema.js";

export const listMembersRoute = createRoute({
  method: "get",
  path: "/members",
  tags: ["Members"],
  summary: "List all members",
  responses: {
    200: {
      content: { "application/json": { schema: MemberListSchema } },
      description: "List of all members",
    },
  },
});

export const getMemberRoute = createRoute({
  method: "get",
  path: "/members/{id}",
  tags: ["Members"],
  summary: "Get a member by ID",
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: {
      content: { "application/json": { schema: MemberSchema } },
      description: "Member found",
    },
    404: {
      content: { "application/json": { schema: ErrorSchema } },
      description: "Member not found",
    },
  },
});

export const createMemberRoute = createRoute({
  method: "post",
  path: "/members",
  tags: ["Members"],
  summary: "Create a new member",
  request: {
    body: {
      content: { "application/json": { schema: CreateMemberSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: MemberSchema } },
      description: "Member created",
    },
  },
});
