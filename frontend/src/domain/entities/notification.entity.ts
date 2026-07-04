export interface Notification {
    id: string;
    title: string;
    message: string;
}

export interface CreateNotificationBody {
    title: string;
    message: string;
}
