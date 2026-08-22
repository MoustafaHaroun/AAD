import type { Listing } from "@/domain/entities";

export const SHARING_SERVICE_TOKEN = Symbol("ISharingService");

export interface ISharingService {
    /**
     * Prompt to share a listing.
     * @param listing - The listing to share.
     */
    shareListing: (listing: Listing) => Promise<void>,
}
