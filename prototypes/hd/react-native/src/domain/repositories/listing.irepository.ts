import type { Listing } from "@/domain/entities";

export const LISTING_REPOSITORY_TOKEN = Symbol("IListingRepository");

export interface IListingRepository {
    /**
     * Get listing by id.
     * @returns A listing.
     */
    getListingById: (listingId: string) => Promise<Listing | null>,

    /**
     * Get all listings corresponding to a user.
     * @returns An array of listings.
     */
    getListingsByUser: (userId: string) => Promise<Listing[]>,

    /**
     * Create a new listing.
     */
    createListing: (userId: string, listing: Listing) => Promise<Listing>,

    /**
     * Edit a listing.
     */
    editListing: (userId: string, listing: Listing) => Promise<Listing>,

    /**
     * Delete a listing.
     */
    deleteListing: (listingId: string) => Promise<void>,
}
