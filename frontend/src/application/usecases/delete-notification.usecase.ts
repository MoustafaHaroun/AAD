import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";

export interface DeleteNotificationParams { id: string }

/**
 * Delete a notification.
 */
export class DeleteNotification extends UseCaseBase<void, DeleteNotificationParams> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    /**
     * Delete the notification.
     * @param params - The use case parameters.
     * @param params.id - The id of the notification to delete.
     */
    public async execute({ id }: DeleteNotificationParams): Promise<void> {
        await this.notificationRepository.deleteNotification(id);
    }
}
