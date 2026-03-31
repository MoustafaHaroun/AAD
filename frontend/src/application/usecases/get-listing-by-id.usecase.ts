import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import {
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

export class GetListingById extends UseCaseBase<Listing> {
    private readonly listingRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(
            LISTING_REPOSITORY_TOKEN,
        );
    }

    async execute(listingId: string): Promise<Listing> {
        return this.listingRepository.getListingById(listingId);
    }
}
