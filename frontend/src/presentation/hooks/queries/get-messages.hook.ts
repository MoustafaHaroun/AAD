import { GetMessages } from "@/application/usecases";
import type { Message } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getMessages = new GetMessages();

export function useGetMessages() {
    return useQuery<Message[], Error>({
        queryKey: ["messages.get"],
        queryFn: () => getMessages.execute(),
    });
}
