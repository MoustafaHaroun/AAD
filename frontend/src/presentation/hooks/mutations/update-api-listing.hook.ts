import { UpdateApiListing, type UpdateApiListingParams } from "@/application/usecases";
import type { ApiListing } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const updateApiListing = new UpdateApiListing();

export function useUpdateApiListing() {
    const queryClient = useQueryClient();

    return useMutation<ApiListing, Error, UpdateApiListingParams>({
        mutationFn: (params) => updateApiListing.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
