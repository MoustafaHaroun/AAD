import type { IAttachmentRepository } from "@/domain/repositories";

export class AttachmentRepository implements IAttachmentRepository {
    public async saveAttachment(uri: string): Promise<string | null> {

    }

    public async deleteAttachment(uri: string): Promise<string | null> {

    }
}
