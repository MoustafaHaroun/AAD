export interface Listing {
    id: string,
    title: string,
    description: string | null,
    location: string,
    user: string,
    attachments: string[],
}
