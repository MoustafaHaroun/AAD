import type { ApiListing } from "@/domain/entities";

/**
 * Determine whether a viewer may edit a listing: its owner, or an admin.
 * @param listing - The loaded listing, if any.
 * @param currentUserId - The viewer's user id, if signed in.
 * @param currentUserRole - The viewer's role, if signed in.
 * @returns Whether the viewer may edit the listing.
 */
export function canManageListing(listing: ApiListing | undefined, currentUserId: string | null, currentUserRole: string | undefined): boolean {
    if (listing == null) {
        return false;
    }

    return listing.user?.id === currentUserId || currentUserRole === "admin";
}
