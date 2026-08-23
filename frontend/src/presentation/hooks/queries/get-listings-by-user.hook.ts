import { GetListingsByUser } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getListingsByUser = new GetListingsByUser();

/**
 * Fetch the listings belonging to a user.
 * @param userId - The listings' owner id.
 * @returns The query for the user's listings.
 */
export function useGetListingsByUser(userId: string): ReturnType<typeof useQuery<void, Error, Listing[]>> {
    return useQuery({
        queryKey: ["listings.get.by_user", userId],
        queryFn: async () => getListingsByUser.execute(userId),
        enabled: userId.length > 0,
    });
}
