import { UploadListingAttachment, type UploadListingAttachmentParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const uploadListingAttachment = new UploadListingAttachment();

/**
 * Upload an attachment to a listing, then invalidate the cached listing.
 * @returns The mutation for uploading a listing attachment.
 */
export function useUploadListingAttachment(): UseMutationResult<void, Error, UploadListingAttachmentParams> {
    const queryClient = useQueryClient();

    return useMutation<void, Error, UploadListingAttachmentParams>({
        mutationFn: async params => uploadListingAttachment.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
