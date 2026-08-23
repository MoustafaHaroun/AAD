import { QueryClient } from "@tanstack/react-query";

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

/**
 * A single shared QueryClient instance, so both the React tree
 * (QueryClientProvider) and non-component code (the API client's session
 * handling) read and write the same cache.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Keep unmounted query data around long enough to actually be
            // Persisted and read back offline, rather than the 5-minute
            // Default garbage-collecting it away.
            gcTime: ONE_DAY_MS,
        },
    },
});
