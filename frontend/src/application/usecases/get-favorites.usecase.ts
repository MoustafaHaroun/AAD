import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

/**
 * Fetch the current user's favorites.
 */
export class GetFavorites extends UseCaseBase<Favorite[]> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the favorites.
     * @returns The current user's favorites.
     */
    public async execute(): Promise<Favorite[]> {
        return this.favoriteRepository.getFavorites();
    }
}
