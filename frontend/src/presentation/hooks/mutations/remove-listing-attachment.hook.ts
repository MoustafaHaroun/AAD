import { RemoveListingAttachment, type RemoveListingAttachmentParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const removeListingAttachment = new RemoveListingAttachment();

export function useRemoveListingAttachment() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, RemoveListingAttachmentParams>({
        mutationFn: (params) => removeListingAttachment.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["api-listings.get", variables.id] });
        },
    });
}
