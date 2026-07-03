import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, gcTime: 5 * 60_000, refetchOnWindowFocus: false },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Prefetch JS chunks + loader data on link hover/focus for instant nav.
    defaultPreload: "intent",
    defaultPreloadDelay: 50,
    // Let TanStack Query own freshness for any preloaded data.
    defaultPreloadStaleTime: 0,
  });

  return router;
};
