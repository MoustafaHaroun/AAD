import { apiClient } from "@/infrastructure/api";
import type { IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

export class FavoriteHttpRepository implements IFavoriteRepository {
    async getFavorites(): Promise<Favorite[]> {
        const { favorites } = await apiClient.get<{ favorites: Favorite[] }>("/favorites");

        return favorites;
    }

    async createFavorite(listingId: string): Promise<Favorite> {
        const { favorite } = await apiClient.post<{ favorite: Favorite }>("/favorites", { listingId });

        return favorite;
    }

    async deleteFavorite(id: string): Promise<void> {
        return apiClient.delete(`/favorites/${id}`);
    }
}
