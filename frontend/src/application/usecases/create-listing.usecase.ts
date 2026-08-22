import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import {
    ATTACHMENT_REPOSITORY_TOKEN, type IAttachmentRepository,
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

export interface CreateListingParams {
    userId: string,
    listing: Listing,
}

export type CreateListingReturnType = Listing;

/**
 * Create a listing, uploading any local attachments first.
 */
export class CreateListing extends UseCaseBase<CreateListingReturnType, CreateListingParams> {
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

    /**
     * Create the listing.
     * @param params - The use case parameters.
     * @param params.userId - The id of the user creating the listing.
     * @param params.listing - The listing to create, including local attachment URIs.
     * @returns The created listing.
     */
    public async execute({ userId, listing }: CreateListingParams): Promise<CreateListingReturnType> {
        const attachments: string[] = [];

        await Promise.all(listing.attachments.map(async attachment => {
            const uri = await this.attachmentRepository.saveAttachment(attachment);

            if (uri != null) {
                attachments.push(uri);
            }
        }));

        return this.listingRepository.createListing(userId, { ...listing, attachments });
    }
}
