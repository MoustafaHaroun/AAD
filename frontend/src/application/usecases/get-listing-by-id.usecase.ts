import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import {
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

/**
 * Fetch a listing by id.
 */
export class GetListingById extends UseCaseBase<Listing> {
    private readonly listingRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(
            LISTING_REPOSITORY_TOKEN,
        );
    }

    /**
     * Fetch the listing.
     * @param listingId - The id of the listing to fetch.
     * @returns The listing.
     */
    public async execute(listingId: string): Promise<Listing> {
        return this.listingRepository.getListingById(listingId);
    }
}
