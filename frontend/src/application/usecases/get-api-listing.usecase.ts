import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing } from "@/domain/entities";

export type GetApiListingParams = { id: string };

export class GetApiListing extends UseCaseBase<ApiListing, GetApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute({ id }: GetApiListingParams): Promise<ApiListing> {
        return this.apiListingRepository.getListing(id);
    }
}
