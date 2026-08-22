import { UpdateNotification, type UpdateNotificationParams } from "@/application/usecases";
import type { Notification } from "@/domain/entities";
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";

const updateNotification = new UpdateNotification();

/**
 * Update a notification (e.g. mark it read), then update the cached list.
 * @returns The mutation for updating a notification.
 */
export function useUpdateNotification(): UseMutationResult<Notification, Error, UpdateNotificationParams> {
    const queryClient = useQueryClient();

    return useMutation<Notification, Error, UpdateNotificationParams>({
        mutationFn: async params => updateNotification.execute(params),
        onSuccess: updated => {
            queryClient.setQueryData<Notification[]>(
                ["notifications.get.all"],
                prev => prev?.map(n => n.id === updated.id ? updated : n),
            );
        },
    });
}
