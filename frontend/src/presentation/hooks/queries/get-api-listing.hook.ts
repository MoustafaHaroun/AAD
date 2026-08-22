import { GetApiListing } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getApiListing = new GetApiListing();

/**
 *
 * @param id
 */
export function useGetApiListing(id: string) {
    const queryClient = useQueryClient();

    return useQuery<ApiListing>({
        queryKey: ["api-listings.get", id],
        queryFn: async () => getApiListing.execute({ id }),
        enabled: id != null,
        // A listing already seen in any cached list (Home, Listings, etc.)
        // Has all the fields this screen needs — show it immediately
        // Instead of waiting on (or failing) a separate network fetch.
        initialData: () => {
            const listQueries = queryClient.getQueriesData<ApiListing[] | ApiListing>({ queryKey: ["api-listings.get"] });

            for (const [, data] of listQueries) {
                if (!Array.isArray(data)) { continue; }

                const match = data.find(listing => listing.id === id);

                if (match != null) { return match; }
            }

            return undefined;
        },
    });
}
