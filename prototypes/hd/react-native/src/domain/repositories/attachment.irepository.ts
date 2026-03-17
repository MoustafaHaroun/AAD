export interface IAttachmentRepository {
    saveAttachment: (uri: string) => Promise<string | null>,
    deleteAttachment: (uri: string) => Promise<string | null>,
}
