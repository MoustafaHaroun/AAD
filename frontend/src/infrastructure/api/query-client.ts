import { QueryClient } from "@tanstack/react-query";

/**
 * A single shared QueryClient instance, so both the React tree
 * (QueryClientProvider) and non-component code (the API client's session
 * handling) read and write the same cache.
 */
export const queryClient = new QueryClient();
