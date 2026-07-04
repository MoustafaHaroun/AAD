import { apiClient } from "@/infrastructure/api";
import type { INotificationRepository } from "@/domain/repositories";
import type { Notification, CreateNotificationBody } from "@/domain/entities";

export class NotificationHttpRepository implements INotificationRepository {
    async getNotification(id: string): Promise<Notification> {
        return apiClient.get<Notification>(`/notifications/${id}`);
    }

    async createNotification(body: CreateNotificationBody): Promise<Notification> {
        return apiClient.post<Notification>("/notifications", body);
    }

    async deleteNotification(id: string): Promise<void> {
        return apiClient.delete(`/notifications/${id}`);
    }
}
