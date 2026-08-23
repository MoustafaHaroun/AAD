import { DeleteFavorite, type DeleteFavoriteParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const deleteFavorite = new DeleteFavorite();

/**
 * Unfavorite a listing, then invalidate cached favorites.
 * @returns The mutation for unfavoriting a listing.
 */
export function useDeleteFavorite(): UseMutationResult<void, Error, DeleteFavoriteParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => deleteFavorite.execute(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["favorites.get"] });
        },
    });
}
