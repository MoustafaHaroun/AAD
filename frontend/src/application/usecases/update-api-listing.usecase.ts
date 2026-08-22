import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, UpdateApiListingBody } from "@/domain/entities";

export interface UpdateApiListingParams { id: string, body: UpdateApiListingBody }

/**
 * Update a listing via the API.
 */
export class UpdateApiListing extends UseCaseBase<ApiListing, UpdateApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Update the listing.
     * @param params - The use case parameters.
     * @param params.id - The id of the listing to update.
     * @param params.body - The fields to update.
     * @returns The updated listing.
     */
    public async execute({ id, body }: UpdateApiListingParams): Promise<ApiListing> {
        return this.apiListingRepository.updateListing(id, body);
    }
}
