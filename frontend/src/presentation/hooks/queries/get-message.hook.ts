import { GetMessage } from "@/application/usecases";
import type { Message } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getMessage = new GetMessage();

/**
 * Fetch a single message by id.
 * @param id - The message id.
 * @returns The query for the message.
 */
export function useGetMessage(id: string): UseQueryResult<Message> {
    return useQuery<Message>({
        queryKey: ["messages.get", id],
        queryFn: async () => getMessage.execute({ id }),
        enabled: id != null,
    });
}
