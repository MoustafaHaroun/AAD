import { GetFavorites } from "@/application/usecases";
import type { Favorite } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getFavorites = new GetFavorites();

export function useGetFavorites() {
    return useQuery<Favorite[], Error>({
        queryKey: ["favorites.get"],
        queryFn: () => getFavorites.execute(),
    });
}
