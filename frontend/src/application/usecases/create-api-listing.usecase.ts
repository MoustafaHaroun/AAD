import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, CreateApiListingBody } from "@/domain/entities";

export class CreateApiListing extends UseCaseBase<ApiListing, CreateApiListingBody> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute(body: CreateApiListingBody): Promise<ApiListing> {
        return this.apiListingRepository.createListing(body);
    }
}
