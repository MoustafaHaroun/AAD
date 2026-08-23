import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";

export interface DeleteApiListingParams { id: string }

/**
 * Delete a listing via the API.
 */
export class DeleteApiListing extends UseCaseBase<void, DeleteApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Delete the listing.
     * @param params - The use case parameters.
     * @param params.id - The id of the listing to delete.
     */
    public async execute({ id }: DeleteApiListingParams): Promise<void> {
        await this.apiListingRepository.deleteListing(id);
    }
}
