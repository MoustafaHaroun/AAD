import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import {
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

export class CreateListing extends UseCaseBase<Listing> {
    private readonly listingRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(
            LISTING_REPOSITORY_TOKEN,
        );
    }

    async execute(userId: string, listing: Listing): Promise<Listing> {
        return this.listingRepository.createListing(userId, listing);
    }
}
