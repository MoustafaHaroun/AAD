import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";

export type DeleteNotificationParams = { id: string };

export class DeleteNotification extends UseCaseBase<void, DeleteNotificationParams> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    async execute({ id }: DeleteNotificationParams): Promise<void> {
        return this.notificationRepository.deleteNotification(id);
    }
}
