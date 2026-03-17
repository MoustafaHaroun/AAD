import { di, UseCaseBase } from "@/infrastructure/di";
import {
    ATTACHMENT_REPOSITORY_TOKEN,
    LISTING_REPOSITORY_TOKEN,
    type IAttachmentRepository,
    type IListingRepository,
} from "@/domain/repositories";
import type { Listing } from "@/domain/entities";

export type DeleteListingParams = {
    listing: Listing,
}

export class DeleteListing extends UseCaseBase<void, DeleteListingParams> {
    private readonly listingRepository;
    private readonly attachmentRepository;

    constructor() {
        super();
        this.listingRepository = di.inject<IListingRepository>(
            LISTING_REPOSITORY_TOKEN,
        );

        this.attachmentRepository = di.inject<IAttachmentRepository>(
            ATTACHMENT_REPOSITORY_TOKEN,
        );
    }

    public async execute({ listing }: DeleteListingParams): Promise<void> {
        await this.listingRepository.deleteListing(listing.id);
        await Promise.all(listing.attachments.map(async attachment => {
            this.attachmentRepository.deleteAttachment(attachment)
        }))
    }
}
