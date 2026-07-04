import { CreateFavorite, type CreateFavoriteParams } from "@/application/usecases";
import type { Favorite } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createFavorite = new CreateFavorite();

export function useCreateFavorite() {
    const queryClient = useQueryClient();

    return useMutation<Favorite, Error, CreateFavoriteParams>({
        mutationFn: (params) => createFavorite.execute(params),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["favorites.get"] });
        },
    });
}
