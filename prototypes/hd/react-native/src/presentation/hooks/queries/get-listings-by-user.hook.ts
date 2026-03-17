import { GetListingsByUser } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getListingsByUser = new GetListingsByUser();

/**
 * Use the getListingsByUser query.
 * @param userId
 * @returns The query values.
 */
export function useGetListingsByUser(userId: string): ReturnType<typeof useQuery<void, Error, Listing[]>> {
    return useQuery({
        queryKey: ["listings.get.byuser", userId],
        queryFn: async () => getListingsByUser.execute(userId),
        enabled: userId != null,
    });
}
