import { GetMessages } from "@/application/usecases";
import type { Message } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getMessages = new GetMessages();

/**
 *
 */
export function useGetMessages() {
    return useQuery<Message[]>({
        queryKey: ["messages.get"],
        queryFn: async () => getMessages.execute(),
        // No WebSocket support on the backend yet — poll for new messages instead.
        refetchInterval: 5000,
    });
}
