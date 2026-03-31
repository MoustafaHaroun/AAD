import { ISharingService } from "@/domain/services";
import type { Listing } from "@/domain/entities";
import Share from "react-native-share";
import { copyFileToCache } from "@/infrastructure/persistence/fs";

export class SharingService implements ISharingService {
    async shareListing(listing: Listing): Promise<void> {
        try {
            const uri = copyFileToCache(listing.attachments[0]);

            if (uri == null) {
                return;
            }

            await Share.open({
                url: uri,
                message: `${listing.title} - ${listing.user}`,
                title: listing.title,
                type: "image/jpeg",
            });
        } catch (error: unknown) {
            if ((error as Error).message !== "User did not share") {
                throw error;
            }
        }
    }
}