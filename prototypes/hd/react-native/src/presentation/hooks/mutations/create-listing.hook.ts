import { CreateListing, type CreateListingParams } from "@/application/usecases";
import type { Listing } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createListing = new CreateListing();

/**
 * Use the create listing mutation.
 */
export function useCreateListing(): ReturnType<
  typeof useMutation<void, Error, CreateListingParams>
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
            await createListing.execute({ userId, listing });
        },
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["listings.get.by_user", variables.userId],
            });
        },
    });
}
