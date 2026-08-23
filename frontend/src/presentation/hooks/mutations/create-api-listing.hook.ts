import { CreateApiListing } from "@/application/usecases";
import type { ApiListing, CreateApiListingBody } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const createApiListing = new CreateApiListing();

/**
 * Create a listing via the API, then invalidate cached listings.
 * @returns The mutation for creating a listing.
 */
export function useCreateApiListing(): UseMutationResult<ApiListing, Error, CreateApiListingBody> {
    const queryClient = useQueryClient();

    return useMutation<ApiListing, Error, CreateApiListingBody>({
        mutationFn: async body => createApiListing.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
        },
    });
}
