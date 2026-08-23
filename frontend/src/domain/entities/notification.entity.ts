export interface Notification {
    id: string,
    title: string,
    message: string,
    read: boolean,
    createdAt: string,
}

export interface CreateNotificationBody {
    title: string,
    message: string,
}

export interface UpdateNotificationBody {
    read?: boolean,
}
