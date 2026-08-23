import { RemoveListingAttachment, type RemoveListingAttachmentParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const removeListingAttachment = new RemoveListingAttachment();

/**
 * Remove an attachment from a listing, then invalidate the cached listing.
 * @returns The mutation for removing a listing attachment.
 */
export function useRemoveListingAttachment(): UseMutationResult<void, Error, RemoveListingAttachmentParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => removeListingAttachment.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
