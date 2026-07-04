import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";
import type { Notification } from "@/domain/entities";

export type GetNotificationParams = { id: string };

export class GetNotification extends UseCaseBase<Notification, GetNotificationParams> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    async execute({ id }: GetNotificationParams): Promise<Notification> {
        return this.notificationRepository.getNotification(id);
    }
}
