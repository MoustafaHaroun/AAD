import { GetFavorites } from "@/application/usecases";
import type { Favorite } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getFavorites = new GetFavorites();

/**
 * Fetch the current user's favorited listings.
 * @returns The query for the current user's favorites.
 */
export function useGetFavorites(): UseQueryResult<Favorite[]> {
    return useQuery<Favorite[]>({
        queryKey: ["favorites.get"],
        queryFn: async () => getFavorites.execute(),
    });
}
