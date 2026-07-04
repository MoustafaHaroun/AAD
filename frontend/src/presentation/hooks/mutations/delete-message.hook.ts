import { DeleteMessage, type DeleteMessageParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteMessage = new DeleteMessage();

export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteMessageParams>({
        mutationFn: (params) => deleteMessage.execute(params),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ["messages.get"] });
            queryClient.removeQueries({ queryKey: ["messages.get", variables.id] });
        },
    });
}
