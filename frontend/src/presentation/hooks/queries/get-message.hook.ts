import { GetMessage } from "@/application/usecases";
import type { Message } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getMessage = new GetMessage();

export function useGetMessage(id: string) {
    return useQuery<Message, Error>({
        queryKey: ["messages.get", id],
        queryFn: () => getMessage.execute({ id }),
        enabled: id != null,
    });
}
