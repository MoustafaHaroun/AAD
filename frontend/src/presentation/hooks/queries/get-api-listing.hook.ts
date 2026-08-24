import { GetApiListing } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useQuery, useQueryClient, type UseQueryResult } from "@tanstack/react-query";

const getApiListing = new GetApiListing();

/**
 * Fetch a single listing by id, falling back to any cached list data.
 * @param id - The listing id.
 * @returns The query for the listing.
 */
export function useGetApiListing(id: string): UseQueryResult<ApiListing> {
    const queryClient = useQueryClient();

    return useQuery<ApiListing>({
        queryKey: ["api-listings.get", id],
        queryFn: async () => getApiListing.execute({ id }),
        enabled: id.length > 0,
        initialData: () => {
            const listQueries = queryClient.getQueriesData<ApiListing[] | ApiListing>({ queryKey: ["api-listings.get"] });

            for (const [, data] of listQueries) {
                if (!Array.isArray(data)) {
                    continue;
                }

                const match = data.find(listing => listing.id === id);

                if (match != null) {
                    return match;
                }
            }

            return undefined;
        },
    });
}
