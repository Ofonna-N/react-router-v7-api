import { OpenAPIHono } from "@hono/zod-openapi";
import { randomUUID } from "crypto";
import { members } from "../db/store.js";
import {
  listMembersRoute,
  getMemberRoute,
  createMemberRoute,
} from "../routes/members.route.js";

export function registerMemberRoutes(app: OpenAPIHono) {
  app.openapi(listMembersRoute, (c) => {
    return c.json({ data: Array.from(members.values()) }, 200);
  });

  app.openapi(getMemberRoute, (c) => {
    const { id } = c.req.valid("param");
    const member = Array.from(members.values()).find((m) => m.id === id);
    if (!member) {
      return c.json({ message: "Member not found" }, 404);
    }
    return c.json(member, 200);
  });

  app.openapi(createMemberRoute, (c) => {
    const body = c.req.valid("json");
    const now = new Date().toISOString();
    const member = {
      id: randomUUID(),
      ...body,
      avatarUrl: body.avatarUrl ?? null,
      createdAt: now,
    };
    members.set(member.id, member);
    return c.json(member, 201);
  });
}
