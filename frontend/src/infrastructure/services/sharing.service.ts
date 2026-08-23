import type { ISharingService, ShareListingParams } from "@/domain/services";
import Share from "react-native-share";
import { File, Paths } from "expo-file-system";

/**
 * Share a listing's title, description, and photo through the OS share sheet.
 */
export class SharingService implements ISharingService {
    /**
     * Share the listing.
     * @param params - The listing's title, share message, and attachment URL, if any.
     * @param params.title - The listing's title.
     * @param params.message - The share message, including the listing's title and description.
     * @param params.attachmentUrl - The listing's first attachment URL, or null if it has none.
     */
    public async shareListing({ title, message, attachmentUrl }: ShareListingParams): Promise<void> {
        try {
            const uri = attachmentUrl == null ? null : await this.downloadAttachment(attachmentUrl);

            await Share.open(uri == null
                ? { message, title }
                : { url: uri, message, title, type: "image/jpeg" });
        } catch (error: unknown) {
            if ((error as Error).message !== "User did not share") {
                throw error;
            }
        }
    }

    /**
     * Download a remote attachment to the local cache so it can be attached to a share.
     * @param url - The remote attachment URL.
     * @returns The local file's URI, or null if the download failed.
     */
    private async downloadAttachment(url: string): Promise<string | null> {
        try {
            const file = await File.downloadFileAsync(url, Paths.cache);

            return file.uri;
        } catch {
            return null;
        }
    }
}
