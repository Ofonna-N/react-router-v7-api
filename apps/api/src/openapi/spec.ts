/**
 * Run this script to write the OpenAPI spec to disk so Orval can consume it.
 *
 * Usage: pnpm generate:spec
 * Output: apps/api/openapi.json
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { app } from "../app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const spec = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: {
    title: "Catalyst API",
    version: "1.0.0",
    description:
      "Type-safe REST API for the Catalyst project management system",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
});

const outPath = resolve(__dirname, "../../openapi.json");
writeFileSync(outPath, JSON.stringify(spec, null, 2));
console.log(`OpenAPI spec written to ${outPath}`);
