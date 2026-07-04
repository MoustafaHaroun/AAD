export interface ApiListingAttachment {
    id: string;
    path: string;
}

export interface ApiListingUser {
    id: string;
    email: string;
    firstname: string;
    surname: string;
    role?: string;
    location?: string | null;
}

export interface ApiListing {
    id: string;
    title: string;
    description?: string;
    attachments?: ApiListingAttachment[];
    user?: ApiListingUser;
}

export interface CreateApiListingBody {
    title: string;
    description?: string;
}

export interface UpdateApiListingBody {
    title?: string;
    description?: string;
}

export interface RNFile {
    uri: string;
    name: string;
    type: string;
}
