import { apiClient } from "@/infrastructure/api";
import type { IApiListingRepository } from "@/domain/repositories";
import type { ApiListing, CreateApiListingBody, UpdateApiListingBody, RNFile } from "@/domain/entities";

export class ApiListingHttpRepository implements IApiListingRepository {
    async getListings(): Promise<ApiListing[]> {
        const response = await apiClient.get<{ listings: ApiListing[] }>("/listings");
        return response.listings ?? [];
    }

    async getListing(id: string): Promise<ApiListing> {
        return apiClient.get<ApiListing>(`/listings/${id}`);
    }

    async createListing(body: CreateApiListingBody): Promise<ApiListing> {
        return apiClient.post<ApiListing>("/listings", body);
    }

    async updateListing(id: string, body: UpdateApiListingBody): Promise<ApiListing> {
        return apiClient.patch<ApiListing>(`/listings/${id}`, body);
    }

    async deleteListing(id: string): Promise<void> {
        return apiClient.delete(`/listings/${id}`);
    }

    async uploadAttachment(id: string, files: RNFile[]): Promise<void> {
        const formData = new FormData();
        for (const file of files) {
            // React Native FormData accepts { uri, name, type } objects
            formData.append("binaries", file as unknown as Blob);
        }
        return apiClient.postFormData<void>(`/listings/${id}/attachments`, formData);
    }

    async removeAttachment(id: string, attachmentId: string): Promise<void> {
        return apiClient.delete(`/listings/${id}/attachments/${attachmentId}`);
    }
}
