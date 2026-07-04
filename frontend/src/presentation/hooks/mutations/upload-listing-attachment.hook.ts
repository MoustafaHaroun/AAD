import { UploadListingAttachment, type UploadListingAttachmentParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const uploadListingAttachment = new UploadListingAttachment();

export function useUploadListingAttachment() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, UploadListingAttachmentParams>({
        mutationFn: (params) => uploadListingAttachment.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
