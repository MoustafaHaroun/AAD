import { DeleteListing } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useImageService } from "@/presentation/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteListing = new DeleteListing();

/**
 *
 */
export function useDeleteListing(): ReturnType<
    typeof useMutation<void, Error, { listing: Listing }>
> {
    const queryClient = useQueryClient();
    const imageService = useImageService();

    return useMutation({
        mutationFn: async ({
            listing,
        }: {
            listing: Listing,
        }) => {
            const uris = [];

            await Promise.all(listing.attachments.map(async attachment => uris.push(await imageService.saveImageLocally(attachment))));
            await deleteListing.execute(listing.id);
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["listings.get.byuser", variables.listing.user],
            });
        },
    });
}
