import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";

export interface RemoveListingAttachmentParams { id: string, attachmentId: string }

/**
 * Remove an attachment from a listing.
 */
export class RemoveListingAttachment extends UseCaseBase<void, RemoveListingAttachmentParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Remove the attachment.
     * @param params - The use case parameters.
     * @param params.id - The id of the listing.
     * @param params.attachmentId - The id of the attachment to remove.
     */
    public async execute({ id, attachmentId }: RemoveListingAttachmentParams): Promise<void> {
        await this.apiListingRepository.removeAttachment(id, attachmentId);
    }
}
