import { DeleteApiListing, type DeleteApiListingParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteApiListing = new DeleteApiListing();

export function useDeleteApiListing() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteApiListingParams>({
        mutationFn: (params) => deleteApiListing.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
            queryClient.removeQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
