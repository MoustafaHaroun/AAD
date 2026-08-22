import { EditListing, type EditListingParams } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const editListing = new EditListing();

/**
 * Edit a listing, then invalidate its cached copy and the owner's cached listings.
 * @returns The mutation for editing a listing.
 */
export function useEditListing(): ReturnType<
    typeof useMutation<void, Error, EditListingParams>
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            userId,
            listing,
        }: {
            userId: string,
            listing: Listing,
        }) => {
            await editListing.execute({ userId, listing });
        },
        onSuccess: async (_, variables) => {
            const keysToInvalidate = [
                ["listing.get.byid", variables.listing.id],
                ["listing.get.byuser", variables.userId],
            ];

            await Promise.all(
                keysToInvalidate.map(async key => queryClient.invalidateQueries({ queryKey: key })),
            );
        },
    });
}
