import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";
import type { RNFile } from "@/domain/entities";

export type UploadListingAttachmentParams = { id: string; files: RNFile[] };

export class UploadListingAttachment extends UseCaseBase<void, UploadListingAttachmentParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute({ id, files }: UploadListingAttachmentParams): Promise<void> {
        return this.apiListingRepository.uploadAttachment(id, files);
    }
}
