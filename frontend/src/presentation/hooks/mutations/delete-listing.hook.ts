import { DeleteListing } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

const deleteListing = new DeleteListing();

/**
 * Delete a listing, invalidate the owner's cached listings, and navigate back.
 * @returns The mutation for deleting a listing.
 */
export function useDeleteListing(): ReturnType<
    typeof useMutation<void, Error, { listing: Listing }>
> {
    const queryClient = useQueryClient();
    const router = useRouter();

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

            router.back();
        },
    });
}
