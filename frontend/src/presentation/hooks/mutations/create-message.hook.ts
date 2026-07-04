import { CreateMessage } from "@/application/usecases";
import type { Message, CreateMessageBody } from "@/domain/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createMessage = new CreateMessage();

export function useCreateMessage() {
    const queryClient = useQueryClient();

    return useMutation<Message, Error, CreateMessageBody>({
        mutationFn: (body) => createMessage.execute(body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["messages.get"] });
        },
    });
}
