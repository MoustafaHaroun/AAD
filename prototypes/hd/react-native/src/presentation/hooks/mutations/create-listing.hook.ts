import { CreateListing } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useImageService } from "@/presentation/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createListing = new CreateListing();

/**
 *
 */
export function useCreateListing(): ReturnType<
  typeof useMutation<void, Error, Listing>
> {
    const queryClient = useQueryClient();
    const imageService = useImageService();

    return useMutation({
        mutationFn: async ({
            userId,
            listing,
        }: {
            userId: string,
            listing: Listing,
        }) => {
            const uris = [];

            for (const attachment of listing.attachments) {
                const uri = await imageService.saveImageLocally(attachment);

                if (uri != null) {
                    uris.push(uri);
                }
            }

            createListing.execute(userId, { ...listing, attachments: uris });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["listings.get.byuser", variables.userId],
            });
        },
    });
}
