import type { ApiListing, CreateApiListingBody, UpdateApiListingBody, RNFile } from "@/domain/entities";

export const API_LISTING_REPOSITORY_TOKEN = Symbol("IApiListingRepository");

export interface IApiListingRepository {
    getListings: () => Promise<ApiListing[]>;
    getListing: (id: string) => Promise<ApiListing>;
    createListing: (body: CreateApiListingBody) => Promise<ApiListing>;
    updateListing: (id: string, body: UpdateApiListingBody) => Promise<ApiListing>;
    deleteListing: (id: string) => Promise<void>;
    uploadAttachment: (id: string, files: RNFile[]) => Promise<void>;
    removeAttachment: (id: string, attachmentId: string) => Promise<void>;
}
