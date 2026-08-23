import { apiClient } from "@/infrastructure/api";
import type { IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, CreateApiListingBody, UpdateApiListingBody, RNFile, GetApiListingsParams } from "@/domain/entities";

/**
 * Fetch, create, update, and delete listings, and manage their attachments, via the API.
 */
export class ApiListingHttpRepository implements IApiListingRepository {
    /**
     * Fetch listings, optionally filtered.
     * @param params - The search/filter parameters.
     * @returns The matching listings.
     */
    public async getListings(params?: GetApiListingsParams): Promise<ApiListing[]> {
        const query = new URLSearchParams();

        if (params?.q != null && params.q.length > 0) {
            query.set("q", params.q);
        }

        if (params?.category != null) {
            query.set("category", params.category);
        }

        if (params?.type != null) {
            query.set("type", params.type);
        }

        const queryString = query.toString();
        const path = queryString.length > 0 ? `/listings?${queryString}` : "/listings";

        const response = await apiClient.get<{ listings: ApiListing[] }>(path);

        return response.listings;
    }

    /**
     * Fetch a single listing.
     * @param id - The id of the listing to fetch.
     * @returns The listing.
     */
    public async getListing(id: string): Promise<ApiListing> {
        const response = await apiClient.get<{ listing: ApiListing }>(`/listings/${id}`);

        return response.listing;
    }

    /**
     * Create a listing.
     * @param body - The listing data to create.
     * @returns The created listing.
     */
    public async createListing(body: CreateApiListingBody): Promise<ApiListing> {
        const response = await apiClient.post<{ listing: ApiListing }>("/listings", body);

        return response.listing;
    }

    /**
     * Update a listing.
     * @param id - The id of the listing to update.
     * @param body - The fields to update.
     * @returns The updated listing.
     */
    public async updateListing(id: string, body: UpdateApiListingBody): Promise<ApiListing> {
        const response = await apiClient.patch<{ listing: ApiListing }>(`/listings/${id}`, body);

        return response.listing;
    }

    /**
     * Delete a listing.
     * @param id - The id of the listing to delete.
     */
    public async deleteListing(id: string): Promise<void> {
        await apiClient.delete(`/listings/${id}`);
    }

    /**
     * Upload attachment files to a listing.
     * @param id - The id of the listing.
     * @param files - The files to upload.
     */
    public async uploadAttachment(id: string, files: RNFile[]): Promise<void> {
        const formData = new FormData();

        for (const file of files) {
            // React Native FormData accepts { uri, name, type } objects
            formData.append("binaries", file as unknown as Blob);
        }

        await apiClient.postFormData<undefined>(`/listings/${id}/attachments`, formData);
    }

    /**
     * Remove an attachment from a listing.
     * @param id - The id of the listing.
     * @param attachmentId - The id of the attachment to remove.
     */
    public async removeAttachment(id: string, attachmentId: string): Promise<void> {
        await apiClient.delete(`/listings/${id}/attachments/${attachmentId}`);
    }
}
