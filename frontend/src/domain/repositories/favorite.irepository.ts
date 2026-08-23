import type { Favorite } from "@/domain/entities";

export const FAVORITE_REPOSITORY_TOKEN = Symbol("IFavoriteRepository");

export interface IFavoriteRepository {
    getFavorites: () => Promise<Favorite[]>,
    createFavorite: (listingId: string) => Promise<Favorite>,
    deleteFavorite: (id: string) => Promise<void>,
}
