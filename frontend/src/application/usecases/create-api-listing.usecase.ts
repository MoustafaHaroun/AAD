import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, CreateApiListingBody } from "@/domain/entities";

/**
 * Create a listing via the API.
 */
export class CreateApiListing extends UseCaseBase<ApiListing, CreateApiListingBody> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Create the listing.
     * @param body - The listing data to create.
     * @returns The created listing.
     */
    public async execute(body: CreateApiListingBody): Promise<ApiListing> {
        return this.apiListingRepository.createListing(body);
    }
}
