import { UpdateApiListing, type UpdateApiListingParams } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const updateApiListing = new UpdateApiListing();

/**
 * Update a listing via the API, then invalidate cached listings.
 * @returns The mutation for updating a listing.
 */
export function useUpdateApiListing(): UseMutationResult<ApiListing, Error, UpdateApiListingParams> {
    const queryClient = useQueryClient();

    return useMutation<ApiListing, Error, UpdateApiListingParams>({
        mutationFn: async params => updateApiListing.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
