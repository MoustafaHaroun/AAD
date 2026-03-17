import type { IAttachmentRepository } from "@/domain/repositories";
import { copyFileToDocument, removeFileFromDocument } from "@/infrastructure/persistence/fs";

export class AttachmentRepository implements IAttachmentRepository {
    public async saveAttachment(uri: string): Promise<string | null> {
        return copyFileToDocument(uri);
    }

    public async deleteAttachment(uri: string): Promise<string | null> {
        return removeFileFromDocument(uri);
    }
}
