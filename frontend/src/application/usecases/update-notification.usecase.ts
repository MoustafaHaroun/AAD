import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";
import type { Notification, UpdateNotificationBody } from "@/domain/entities";

export interface UpdateNotificationParams extends UpdateNotificationBody { id: string }

/**
 * Update a notification.
 */
export class UpdateNotification extends UseCaseBase<Notification, UpdateNotificationParams> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    /**
     * Update the notification.
     * @param params - The use case parameters.
     * @param params.id - The id of the notification to update.
     * @returns The updated notification.
     */
    public async execute({ id, ...body }: UpdateNotificationParams): Promise<Notification> {
        return this.notificationRepository.updateNotification(id, body);
    }
}
