import type { ListingCategory, ListingType } from "@/domain/entities/listing-category.entity";

export interface ApiListingAttachment {
    id: string,
    path: string,
}

export interface ApiListingUser {
    id: string,
    email: string,
    firstname: string,
    surname: string,
    role?: string,
    location?: string | null,
    latitude?: number | null,
    longitude?: number | null,
}

export interface ApiListing {
    id: string,
    title: string,
    description?: string,
    category?: ListingCategory,
    type?: ListingType,
    attachments?: ApiListingAttachment[],
    user?: ApiListingUser,
}

export interface CreateApiListingBody {
    title: string,
    description?: string,
    category: ListingCategory,
    type: ListingType,
}

export interface UpdateApiListingBody {
    title?: string,
    description?: string,
    category?: ListingCategory,
    type?: ListingType,
}

export interface GetApiListingsParams {
    q?: string,
    category?: ListingCategory,
    type?: ListingType,
}

export interface RNFile {
    uri: string,
    name: string,
    type: string,
}
