import { GetApiListings } from "@/application/usecases";
import type { ApiListing, GetApiListingsParams } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getApiListings = new GetApiListings();

/**
 *
 * @param params
 */
export function useGetApiListings(params: GetApiListingsParams = {}) {
    return useQuery<ApiListing[]>({
        queryKey: ["api-listings.get", params],
        queryFn: async () => getApiListings.execute(params),
    });
}
