import { CreateMessage } from "@/application/usecases";
import type { Message, CreateMessageBody } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const createMessage = new CreateMessage();

/**
 * Send a message, then invalidate cached messages.
 * @returns The mutation for sending a message.
 */
export function useCreateMessage(): UseMutationResult<Message, Error, CreateMessageBody> {
    const queryClient = useQueryClient();

    return useMutation<Message, Error, CreateMessageBody>({
        mutationFn: async body => createMessage.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["messages.get"] });
        },
    });
}
