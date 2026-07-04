import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

export type CreateFavoriteParams = { listingId: string };

export class CreateFavorite extends UseCaseBase<Favorite, CreateFavoriteParams> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    async execute({ listingId }: CreateFavoriteParams): Promise<Favorite> {
        return this.favoriteRepository.createFavorite(listingId);
    }
}
