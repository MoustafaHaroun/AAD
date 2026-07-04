import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing } from "@/domain/entities";

export class GetApiListings extends UseCaseBase<ApiListing[]> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute(): Promise<ApiListing[]> {
        return this.apiListingRepository.getListings();
    }
}
