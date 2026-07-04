import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, UpdateApiListingBody } from "@/domain/entities";

export type UpdateApiListingParams = { id: string; body: UpdateApiListingBody };

export class UpdateApiListing extends UseCaseBase<ApiListing, UpdateApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute({ id, body }: UpdateApiListingParams): Promise<ApiListing> {
        return this.apiListingRepository.updateListing(id, body);
    }
}
