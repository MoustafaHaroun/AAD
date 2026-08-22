import { GetNotifications } from "@/application/usecases";
import type { Notification } from "@/domain/entities";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const getNotifications = new GetNotifications();

const REFETCH_INTERVAL_MS = 15000;

/**
 * Fetch the current user's notifications, polling for new ones.
 * @returns The query for the current user's notifications.
 */
export function useGetNotifications(): UseQueryResult<Notification[]> {
    return useQuery<Notification[]>({
        queryKey: ["notifications.get.all"],
        queryFn: async () => getNotifications.execute(),
        refetchInterval: REFETCH_INTERVAL_MS,
    });
}
