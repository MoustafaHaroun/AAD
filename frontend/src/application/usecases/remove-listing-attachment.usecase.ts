import { di, UseCaseBase } from "@/infrastructure/di";
import { API_LISTING_REPOSITORY_TOKEN, type IApiListingRepository } from "@/domain/repositories";

export type RemoveListingAttachmentParams = { id: string; attachmentId: string };

export class RemoveListingAttachment extends UseCaseBase<void, RemoveListingAttachmentParams> {
    private readonly apiListingRepository;

    constructor() {
        super();
        this.apiListingRepository = di.inject<IApiListingRepository>(API_LISTING_REPOSITORY_TOKEN);
    }

    async execute({ id, attachmentId }: RemoveListingAttachmentParams): Promise<void> {
        return this.apiListingRepository.removeAttachment(id, attachmentId);
    }
}
