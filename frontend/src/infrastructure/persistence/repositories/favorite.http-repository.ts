import { apiClient } from "@/infrastructure/api";
import type { IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

interface ApiFavorite {
    id: string,
    listing: { id: string },
}

/**
 * Map an API favorite response into the domain's flat Favorite shape.
 * @param apiFavorite - The raw API favorite.
 * @returns The mapped favorite.
 */
function toFavorite(apiFavorite: ApiFavorite): Favorite {
    return { id: apiFavorite.id, listingId: apiFavorite.listing.id };
}

/**
 * Manage the current user's favorited listings via the API.
 */
export class FavoriteHttpRepository implements IFavoriteRepository {
    /**
     * Fetch the current user's favorites.
     * @returns The current user's favorites.
     */
    public async getFavorites(): Promise<Favorite[]> {
        const { favorites } = await apiClient.get<{ favorites: ApiFavorite[] }>("/favorites");

        return favorites.map(toFavorite);
    }

    /**
     * Favorite a listing.
     * @param listingId - The id of the listing to favorite.
     * @returns The created favorite.
     */
    public async createFavorite(listingId: string): Promise<Favorite> {
        const { favorite } = await apiClient.post<{ favorite: ApiFavorite }>("/favorites", { listingId });

        return toFavorite(favorite);
    }

    /**
     * Remove a favorite.
     * @param id - The id of the favorite to delete.
     */
    public async deleteFavorite(id: string): Promise<void> {
        await apiClient.delete(`/favorites/${id}`);
    }
}
