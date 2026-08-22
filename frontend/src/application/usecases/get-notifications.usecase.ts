import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";
import type { Notification } from "@/domain/entities";

/**
 * Fetch the current user's notifications.
 */
export class GetNotifications extends UseCaseBase<Notification[]> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the notifications.
     * @returns The current user's notifications, newest first.
     */
    public async execute(): Promise<Notification[]> {
        return this.notificationRepository.getNotifications();
    }
}
