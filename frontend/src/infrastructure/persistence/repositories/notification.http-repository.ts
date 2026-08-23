import { apiClient } from "@/infrastructure/api";
import type { INotificationRepository } from "@/domain/repositories";
import type { Notification, CreateNotificationBody, UpdateNotificationBody } from "@/domain/entities";

/**
 * Fetch, create, update, and delete notifications via the API.
 */
export class NotificationHttpRepository implements INotificationRepository {
    /**
     * Fetch the current user's notifications.
     * @returns The notifications, newest first.
     */
    public async getNotifications(): Promise<Notification[]> {
        const { notifications } = await apiClient.get<{ notifications: Notification[] }>("/notifications");

        return notifications;
    }

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
     * Update a notification.
     * @param id - The id of the notification to update.
     * @param body - The fields to update.
     * @returns The updated notification.
     */
    public async updateNotification(id: string, body: UpdateNotificationBody): Promise<Notification> {
        const { notification } = await apiClient.patch<{ notification: Notification }>(`/notifications/${id}`, body);

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
