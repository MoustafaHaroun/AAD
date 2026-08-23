import { di, UseCaseBase } from "@/infrastructure/di";
import { FAVORITE_REPOSITORY_TOKEN, type IFavoriteRepository } from "@/domain/repositories";

export interface DeleteFavoriteParams { id: string }

/**
 * Remove a favorite.
 */
export class DeleteFavorite extends UseCaseBase<void, DeleteFavoriteParams> {
    private readonly favoriteRepository;

    constructor() {
        super();
        this.favoriteRepository = di.inject<IFavoriteRepository>(FAVORITE_REPOSITORY_TOKEN);
    }

    /**
     * Delete the favorite.
     * @param params - The use case parameters.
     * @param params.id - The id of the favorite to delete.
     */
    public async execute({ id }: DeleteFavoriteParams): Promise<void> {
        await this.favoriteRepository.deleteFavorite(id);
    }
}
