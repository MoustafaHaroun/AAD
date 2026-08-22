import { Injectable } from '@nestjs/common';
import {
  GetNotificationsByUserIdRequest,
  GetNotificationsByUserIdResponse,
} from '@/application/dto/notifications/get-notifications-by-user-id.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

@Injectable()
export class GetNotificationsByUserIdUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    dto: GetNotificationsByUserIdRequest,
  ): Promise<GetNotificationsByUserIdResponse> {
    const notifications = await this.notificationRepository.findAllByUserId(
      dto.userId,
    );

    return {
      notifications: notifications.map((n) => n.toDomain()),
    };
  }
}
