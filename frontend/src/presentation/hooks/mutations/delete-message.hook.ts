import { DeleteMessage, type DeleteMessageParams } from "@/application/usecases";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const deleteMessage = new DeleteMessage();

/**
 * Delete a message, then evict it from cached messages.
 * @returns The mutation for deleting a message.
 */
export function useDeleteMessage(): UseMutationResult<void, Error, DeleteMessageParams> {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteMessageParams>({
        mutationFn: async params => deleteMessage.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["messages.get"] });
            queryClient.removeQueries({ queryKey: ["messages.get", variables.id] });
        },
    });
}
