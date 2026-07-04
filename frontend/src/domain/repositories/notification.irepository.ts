import type { Notification, CreateNotificationBody } from "@/domain/entities";

export const NOTIFICATION_REPOSITORY_TOKEN = Symbol("INotificationRepository");

export interface INotificationRepository {
    getNotification: (id: string) => Promise<Notification>;
    createNotification: (body: CreateNotificationBody) => Promise<Notification>;
    deleteNotification: (id: string) => Promise<void>;
}
