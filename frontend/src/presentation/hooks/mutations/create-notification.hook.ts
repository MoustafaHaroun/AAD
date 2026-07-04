import { CreateNotification } from "@/application/usecases";
import type { Notification, CreateNotificationBody } from "@/domain/entities";
import { useMutation } from "@tanstack/react-query";

const createNotification = new CreateNotification();

export function useCreateNotification() {
    return useMutation<Notification, Error, CreateNotificationBody>({
        mutationFn: (body) => createNotification.execute(body),
    });
}
