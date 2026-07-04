import { DeleteFavorite, type DeleteFavoriteParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteFavorite = new DeleteFavorite();

export function useDeleteFavorite() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteFavoriteParams>({
        mutationFn: (params) => deleteFavorite.execute(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["favorites.get"] });
        },
    });
}
