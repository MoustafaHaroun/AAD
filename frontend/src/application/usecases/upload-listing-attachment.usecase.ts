import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { RNFile } from "@/domain/entities";

export interface UploadListingAttachmentParams { id: string, files: RNFile[] }

/**
 * Upload attachment files to a listing.
 */
export class UploadListingAttachment extends UseCaseBase<void, UploadListingAttachmentParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    /**
     * Upload the attachments.
     * @param params - The use case parameters.
     * @param params.id - The id of the listing.
     * @param params.files - The files to upload.
     */
    public async execute({ id, files }: UploadListingAttachmentParams): Promise<void> {
        await this.apiListingRepository.uploadAttachment(id, files);
    }
}
