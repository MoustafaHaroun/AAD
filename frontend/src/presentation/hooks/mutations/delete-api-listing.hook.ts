import { DeleteApiListing, type DeleteApiListingParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const deleteApiListing = new DeleteApiListing();

/**
 * Delete a listing via the API, then evict it from cached listings.
 * @returns The mutation for deleting a listing.
 */
export function useDeleteApiListing(): UseMutationResult<void, Error, DeleteApiListingParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => deleteApiListing.execute(params),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
            queryClient.removeQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
