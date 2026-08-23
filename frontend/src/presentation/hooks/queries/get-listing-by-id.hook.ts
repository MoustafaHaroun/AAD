import { GetListingById } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getListingById = new GetListingById();

/**
 * Use the getListingById query.
 * @param listingId - The listing ID.
 * @returns The query values.
 */
export function useGetListingById(
    listingId: string,
): ReturnType<typeof useQuery<void, Error, Listing>> {
    return useQuery({
        queryKey: ["listing.get.byid", listingId],
        queryFn: async () => getListingById.execute(listingId),
        enabled: listingId.length > 0,
    });
}
