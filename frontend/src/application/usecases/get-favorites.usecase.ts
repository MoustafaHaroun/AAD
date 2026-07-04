import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";
import type { Favorite } from "@/domain/entities";

export class GetFavorites extends UseCaseBase<Favorite[]> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    async execute(): Promise<Favorite[]> {
        return this.favoriteRepository.getFavorites();
    }
}
