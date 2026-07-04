import { di, UseCaseBase } from "@/infrastructure/di";
import { NOTIFICATION_REPOSITORY_TOKEN, type INotificationRepository } from "@/domain/repositories";
import type { Notification, CreateNotificationBody } from "@/domain/entities";

export class CreateNotification extends UseCaseBase<Notification, CreateNotificationBody> {
    private readonly notificationRepository;

    constructor() {
        super();
        this.notificationRepository = di.inject<INotificationRepository>(NOTIFICATION_REPOSITORY_TOKEN);
    }

    async execute(body: CreateNotificationBody): Promise<Notification> {
        return this.notificationRepository.createNotification(body);
    }
}
