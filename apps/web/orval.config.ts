import { defineConfig } from "orval";

export default defineConfig({
  catalyst: {
    input: {
      target: "../api/openapi.json",
      validation: false,
    },
    output: {
      mode: "tags-split",
      target: "app/api/generated",
      schemas: "app/api/generated/schemas",
      client: "react-query",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "app/lib/fetch-client.ts",
          name: "fetchClient",
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
