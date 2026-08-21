import { apiClient } from "@/infrastructure/api";
import type { INotificationRepository } from "@/domain/repositories";
import type { Notification, CreateNotificationBody } from "@/domain/entities";

export class NotificationHttpRepository implements INotificationRepository {
    async getNotification(id: string): Promise<Notification> {
        const { notification } = await apiClient.get<{ notification: Notification }>(`/notifications/${id}`);

        return notification;
    }

    async createNotification(body: CreateNotificationBody): Promise<Notification> {
        const { notification } = await apiClient.post<{ notification: Notification }>("/notifications", body);

        return notification;
    }

    async deleteNotification(id: string): Promise<void> {
        return apiClient.delete(`/notifications/${id}`);
    }
}
