import { GetApiListings } from "@/application/usecases";
import type { ApiListing, GetApiListingsParams } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getApiListings = new GetApiListings();

/**
 * Fetch listings via the API.
 * @param params - Optional filters, included in the cache key.
 * @returns The query for the listings.
 */
export function useGetApiListings(params: GetApiListingsParams = {}): UseQueryResult<ApiListing[]> {
    return useQuery<ApiListing[]>({
        queryKey: ["api-listings.get", params],
        queryFn: async () => getApiListings.execute(params),
    });
}
