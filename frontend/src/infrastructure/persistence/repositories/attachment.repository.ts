import type { IAttachmentRepository } from "@/domain/repositories";
import { copyFileToDocument, removeFileFromDocument } from "@/infrastructure/persistence/fs";

/**
 * Persist listing attachment files to local disk.
 */
export class AttachmentRepository implements IAttachmentRepository {
    /**
     * Copy a picked file into the app's document directory so it survives after the picker's temp file is gone.
     * @param uri - The source file URI.
     * @returns The new document-directory URI, or null if the file could not be copied.
     */
    public async saveAttachment(uri: string): Promise<string | null> {
        const savedUri = await Promise.resolve(copyFileToDocument(uri));

        return savedUri;
    }

    /**
     * Remove a previously saved attachment file from local disk.
     * @param uri - The document-directory URI to remove.
     * @returns The removed URI, or null if the file did not exist.
     */
    public async deleteAttachment(uri: string): Promise<string | null> {
        const removedUri = await Promise.resolve(removeFileFromDocument(uri));

        return removedUri;
    }
}
