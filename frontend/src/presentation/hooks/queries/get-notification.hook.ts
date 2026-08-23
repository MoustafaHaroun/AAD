import { GetNotification } from "@/application/usecases";
import type { Notification } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getNotification = new GetNotification();

/**
 * Fetch a single notification by id.
 * @param id - The notification id.
 * @returns The query for the notification.
 */
export function useGetNotification(id: string): UseQueryResult<Notification> {
    return useQuery<Notification>({
        queryKey: ["notifications.get", id],
        queryFn: async () => getNotification.execute({ id }),
        enabled: id.length > 0,
    });
}
