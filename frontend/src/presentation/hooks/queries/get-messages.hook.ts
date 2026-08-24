import { GetMessages } from "@/application/usecases";
import type { Message } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getMessages = new GetMessages();

/**
 * Fetch all of the current user's messages, polling for new ones.
 * @returns The query for the messages.
 */
export function useGetMessages(): UseQueryResult<Message[]> {
    return useQuery<Message[]>({
        queryKey: ["messages.get"],
        queryFn: async () => getMessages.execute(),
        refetchInterval: 5000,
    });
}
