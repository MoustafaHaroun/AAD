import { CreateFavorite, type CreateFavoriteParams } from "@/application/usecases";
import type { Favorite } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const createFavorite = new CreateFavorite();

/**
 * Favorite a listing, then invalidate cached favorites.
 * @returns The mutation for favoriting a listing.
 */
export function useCreateFavorite(): UseMutationResult<Favorite, Error, CreateFavoriteParams> {
    const queryClient = useQueryClient();

    return useMutation<Favorite, Error, CreateFavoriteParams>({
        mutationFn: async params => createFavorite.execute(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["favorites.get"] });
        },
    });
}
