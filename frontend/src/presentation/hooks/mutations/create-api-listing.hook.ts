import { CreateApiListing } from "@/application/usecases";
import type { ApiListing, CreateApiListingBody } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createApiListing = new CreateApiListing();

export function useCreateApiListing() {
    const queryClient = useQueryClient();

    return useMutation<ApiListing, Error, CreateApiListingBody>({
        mutationFn: (body) => createApiListing.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get"] });
        },
    });
}
