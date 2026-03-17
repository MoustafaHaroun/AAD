import { di, UseCaseBase } from "@/infrastructure/di";
import {
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

export class DeleteListing extends UseCaseBase<void> {
    private readonly listingRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(
            LISTING_REPOSITORY_TOKEN,
        );
    }

    public async execute(listingId: string): Promise<void> {
        return this.listingRepository.deleteListing(listingId);
    }
}
