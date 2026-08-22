import { apiClient } from "@/infrastructure/api";
import type { INotificationRepository } from "@/domain/repositories";
import type { Notification, CreateNotificationBody } from "@/domain/entities";

/**
 * Fetch, create, and delete notifications via the API.
 */
export class NotificationHttpRepository implements INotificationRepository {
    /**
     * Fetch a single notification.
     * @param id - The id of the notification to fetch.
     * @returns The notification.
     */
    public async getNotification(id: string): Promise<Notification> {
        const { notification } = await apiClient.get<{ notification: Notification }>(`/notifications/${id}`);

        return notification;
    }

    /**
     * Create a notification.
     * @param body - The notification data to create.
     * @returns The created notification.
     */
    public async createNotification(body: CreateNotificationBody): Promise<Notification> {
        const { notification } = await apiClient.post<{ notification: Notification }>("/notifications", body);

        return notification;
    }

    /**
     * Delete a notification.
     * @param id - The id of the notification to delete.
     */
    public async deleteNotification(id: string): Promise<void> {
        await apiClient.delete(`/notifications/${id}`);
    }
}
