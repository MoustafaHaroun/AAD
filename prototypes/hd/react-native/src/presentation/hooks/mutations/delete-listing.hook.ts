import { DeleteListing } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteListing = new DeleteListing();

/**
 * Use the delete listing mutation.
 */
export function useDeleteListing(): ReturnType<
    typeof useMutation<void, Error, { listing: Listing }>
> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            listing,
        }: {
            listing: Listing,
        }) => {
            await deleteListing.execute({ listing });
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["listings.get.by_user", variables.listing.user],
            });
        },
    });
}
