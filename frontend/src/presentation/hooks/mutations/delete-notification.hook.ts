import { DeleteNotification, type DeleteNotificationParams } from "@/application/usecases";
import type { Notification } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const deleteNotification = new DeleteNotification();

/**
 * Delete a notification, then evict it from the cache.
 * @returns The mutation for deleting a notification.
 */
export function useDeleteNotification(): UseMutationResult<void, Error, DeleteNotificationParams> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async params => deleteNotification.execute(params),
        onSuccess: (_, variables) => {
            queryClient.removeQueries({ queryKey: ["notifications.get", variables.id] });
            queryClient.setQueryData<Notification[]>(
                ["notifications.get.all"],
                prev => prev?.filter(n => n.id !== variables.id),
            );
        },
    });
}
