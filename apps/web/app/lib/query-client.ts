import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 30 seconds before a background refetch
      staleTime: 1000 * 30,
      // Keep unused data in cache for 5 minutes
      gcTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
