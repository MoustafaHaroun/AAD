import { apiClient } from "@/infrastructure/api";
import type { IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

interface ApiFavorite {
    id: string,
    listing: { id: string },
}

/**
 *
 * @param apiFavorite
 */
function toFavorite(apiFavorite: ApiFavorite): Favorite {
    return { id: apiFavorite.id, listingId: apiFavorite.listing.id };
}

export class FavoriteHttpRepository implements IFavoriteRepository {
    async getFavorites(): Promise<Favorite[]> {
        const { favorites } = await apiClient.get<{ favorites: ApiFavorite[] }>("/favorites");

        return favorites.map(toFavorite);
    }

    async createFavorite(listingId: string): Promise<Favorite> {
        const { favorite } = await apiClient.post<{ favorite: ApiFavorite }>("/favorites", { listingId });

        return toFavorite(favorite);
    }

    async deleteFavorite(id: string): Promise<void> {
        return apiClient.delete(`/favorites/${id}`);
    }
}
