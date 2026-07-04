import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";

export type DeleteApiListingParams = { id: string };

export class DeleteApiListing extends UseCaseBase<void, DeleteApiListingParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute({ id }: DeleteApiListingParams): Promise<void> {
        return this.apiListingRepository.deleteListing(id);
    }
}
