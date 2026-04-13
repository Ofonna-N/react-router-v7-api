import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { registerMemberRoutes } from "./handlers/members.handler.js";
import { registerProjectRoutes } from "./handlers/projects.handler.js";
import { registerTaskRoutes } from "./handlers/tasks.handler.js";

export const app = new OpenAPIHono();

// CORS — allow the frontend (dev or production)
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
app.use(
  "*",
  cors({
    origin: clientOrigin,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// Register all route handlers
registerMemberRoutes(app);
registerProjectRoutes(app);
registerTaskRoutes(app);

// Serve the OpenAPI spec as JSON
app.doc("/openapi.json", {
  openapi: "3.1.0",
  info: {
    title: "Catalyst API",
    version: "1.0.0",
    description:
      "Type-safe REST API for the Catalyst project management system",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
});
