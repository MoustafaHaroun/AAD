import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";

export type DeleteFavoriteParams = { id: string };

export class DeleteFavorite extends UseCaseBase<void, DeleteFavoriteParams> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    async execute({ id }: DeleteFavoriteParams): Promise<void> {
        return this.favoriteRepository.deleteFavorite(id);
    }
}
