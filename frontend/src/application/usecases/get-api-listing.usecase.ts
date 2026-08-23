import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing } from "@/domain/entities";

export interface GetApiListingParams { id: string }

/**
 * Fetch a single listing via the API.
 */
export class GetApiListing extends UseCaseBase<ApiListing, GetApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the listing.
     * @param params - The use case parameters.
     * @param params.id - The id of the listing to fetch.
     * @returns The listing.
     */
    public async execute({ id }: GetApiListingParams): Promise<ApiListing> {
        return this.apiListingRepository.getListing(id);
    }
}
