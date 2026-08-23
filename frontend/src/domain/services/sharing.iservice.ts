export const SHARING_SERVICE_TOKEN = Symbol("ISharingService");

export interface ShareListingParams {
    readonly title: string,
    readonly message: string,
    readonly attachmentUrl: string | null,
}

export interface ISharingService {
    /**
     * Prompt to share a listing.
     * @param params - The listing's title, share message, and attachment URL, if any.
     */
    shareListing: (params: ShareListingParams) => Promise<void>,
}
