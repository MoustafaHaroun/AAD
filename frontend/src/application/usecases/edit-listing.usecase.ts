import { di, UseCaseBase } from "@/infrastructure/di";
import type { Listing } from "@/domain/entities";
import {
    ATTACHMENT_REPOSITORY_TOKEN, type IAttachmentRepository,
    type IListingRepository,
    LISTING_REPOSITORY_TOKEN,
} from "@/domain/repositories";

export interface EditListingParams {
    userId: string,
    listing: Listing,
}

export type EditListingReturnType = Listing;

/**
 * Edit a listing, reconciling its attachments with the incoming set.
 */
export class EditListing extends UseCaseBase<EditListingReturnType, EditListingParams> {
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
     * Edit the listing, saving new attachments and deleting removed ones.
     * @param params - The use case parameters.
     * @param params.userId - The id of the user editing the listing.
     * @param params.listing - The listing's new state, including local attachment URIs.
     * @returns The updated listing.
     * @throws {Error} When no listing exists with the given id.
     */
    public async execute({ userId, listing }: EditListingParams): Promise<EditListingReturnType> {
        const existing = await this.listingRepository.getListingById(listing.id);

        if (existing == null) {
            throw new Error("Listing not found");
        }

        const existingAttachments = existing.attachments;
        const incomingAttachments = listing.attachments;

        const attachmentsToSave = incomingAttachments.filter(a => !existingAttachments.includes(a));
        const attachmentsToKeep = incomingAttachments.filter(a => existingAttachments.includes(a));
        const attachmentsToDelete = existingAttachments.filter(a => !incomingAttachments.includes(a));

        const savedAttachments: string[] = [];

        await Promise.all(
            attachmentsToSave.map(async (attachment: string) => {
                const uri = await this.attachmentRepository.saveAttachment(attachment);

                if (uri != null) {
                    savedAttachments.push(uri);
                }
            }),
        );

        await Promise.all(
            attachmentsToDelete.map(async (attachment: string) => {
                await this.attachmentRepository.deleteAttachment(attachment);
            }),
        );

        const finalAttachments = [...attachmentsToKeep, ...savedAttachments];

        return this.listingRepository.editListing(userId, {
            ...listing,
            attachments: finalAttachments,
        });
    }
}
