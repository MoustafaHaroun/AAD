import type { Notification, CreateNotificationBody, UpdateNotificationBody } from "@/domain/entities";

export const NOTIFICATION_REPOSITORY_TOKEN = Symbol("INotificationRepository");

export interface INotificationRepository {
    getNotifications: () => Promise<Notification[]>,
    getNotification: (id: string) => Promise<Notification>,
    createNotification: (body: CreateNotificationBody) => Promise<Notification>,
    updateNotification: (id: string, body: UpdateNotificationBody) => Promise<Notification>,
    deleteNotification: (id: string) => Promise<void>,
}
