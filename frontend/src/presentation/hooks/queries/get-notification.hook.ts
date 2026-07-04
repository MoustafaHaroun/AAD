import { GetNotification } from "@/application/usecases";
import type { Notification } from "@/domain/entities";
import { useQuery } from "@tanstack/react-query";

const getNotification = new GetNotification();

export function useGetNotification(id: string) {
    return useQuery<Notification, Error>({
        queryKey: ["notifications.get", id],
        queryFn: () => getNotification.execute({ id }),
        enabled: id != null,
    });
}
