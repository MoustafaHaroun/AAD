import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import { type IListingRepository, LISTING_REPOSITORY_TOKEN } from "@/domain/repositories";

/**
 * Fetch the listings created by a user.
 */
export class GetListingsByUser extends UseCaseBase<Listing[]> {
    private readonly listingRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the listings.
     * @param userId - The id of the user whose listings to fetch.
     * @returns The user's listings.
     */
    public async execute(userId: string): Promise<Listing[]> {
        return this.listingRepository.getListingsByUser(userId);
    }
}
