export const ATTACHMENT_REPOSITORY_TOKEN = Symbol("AttachmentRepositoryToken");

export interface IAttachmentRepository {
    saveAttachment: (uri: string) => Promise<string | null>,
    deleteAttachment: (uri: string) => Promise<string | null>,
}
