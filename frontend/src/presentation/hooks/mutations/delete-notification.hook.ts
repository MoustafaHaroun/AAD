import { DeleteNotification, type DeleteNotificationParams } from "@/application/usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteNotification = new DeleteNotification();

export function useDeleteNotification() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, DeleteNotificationParams>({
        mutationFn: (params) => deleteNotification.execute(params),
        onSuccess: async (_, variables) => {
            queryClient.removeQueries({ queryKey: ["notifications.get", variables.id] });
        },
    });
}
