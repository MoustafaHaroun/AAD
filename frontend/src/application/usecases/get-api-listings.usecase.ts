import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, GetApiListingsParams } from "@/domain/entities";

/**
 * Fetch listings via the API, optionally filtered.
 */
export class GetApiListings extends UseCaseBase<ApiListing[], GetApiListingsParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the listings.
     * @param params - The search/filter parameters.
     * @returns The matching listings.
     */
    public async execute(params: GetApiListingsParams): Promise<ApiListing[]> {
        return this.apiListingRepository.getListings(params);
    }
}
