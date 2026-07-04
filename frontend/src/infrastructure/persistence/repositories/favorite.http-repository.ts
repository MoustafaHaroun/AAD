import { apiClient } from "@/infrastructure/api";
import type { IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

export class FavoriteHttpRepository implements IFavoriteRepository {
    async getFavorites(): Promise<Favorite[]> {
        return apiClient.get<Favorite[]>("/favorites");
    }

    async createFavorite(listingId: string): Promise<Favorite> {
        return apiClient.post<Favorite>("/favorites", { listingId });
    }

    async deleteFavorite(id: string): Promise<void> {
        return apiClient.delete(`/favorites/${id}`);
    }
}
