import { CreateNotification } from "@/application/usecases";
import type { Notification, CreateNotificationBody } from "@/domain/entities";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

const createNotification = new CreateNotification();

/**
 * Create a notification.
 * @returns The mutation for creating a notification.
 */
export function useCreateNotification(): UseMutationResult<Notification, Error, CreateNotificationBody> {
    return useMutation<Notification, Error, CreateNotificationBody>({
        mutationFn: async body => createNotification.execute(body),
    });
}
