import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

export interface CreateFavoriteParams { listingId: string }

/**
 * Favorite a listing for the current user.
 */
export class CreateFavorite extends UseCaseBase<Favorite, CreateFavoriteParams> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    /**
     * Create the favorite.
     * @param params - The use case parameters.
     * @param params.listingId - The listing to favorite.
     * @returns The created favorite.
     */
    public async execute({ listingId }: CreateFavoriteParams): Promise<Favorite> {
        return this.favoriteRepository.createFavorite(listingId);
    }
}
