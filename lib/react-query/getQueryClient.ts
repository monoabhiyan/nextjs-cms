import { isServer, QueryClient } from "@tanstack/react-query";

// Use React cache to ensure only one instance per request on the server
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR Default options
        staleTime: Infinity, // Treat hydrated data as always fresh—no immediate refetch
        gcTime: 1000 * 60 * 60 * 24, // Keep inactive data for 24h (optional)
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
