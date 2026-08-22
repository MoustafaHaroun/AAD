import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";
import type { Notification } from "@/domain/entities";

export interface GetNotificationParams { id: string }

/**
 * Fetch a single notification.
 */
export class GetNotification extends UseCaseBase<Notification, GetNotificationParams> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the notification.
     * @param params - The use case parameters.
     * @param params.id - The id of the notification to fetch.
     * @returns The notification.
     */
    public async execute({ id }: GetNotificationParams): Promise<Notification> {
        return this.notificationRepository.getNotification(id);
    }
}
