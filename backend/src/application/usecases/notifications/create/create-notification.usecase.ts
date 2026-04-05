import { v4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import {
  CreateNotificationRequest,
  CreateNotificationResponse,
} from '@/application/dto/notifications/create-notification.dto';
import { NotificationModel } from '@/infrastructure/persistence/typeorm/models/notification.model';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    dto: CreateNotificationRequest,
  ): Promise<CreateNotificationResponse> {
    const newNotification = new NotificationModel();

    newNotification.id = v4();
    newNotification.title = dto.title;
    newNotification.message = dto.message;

    return {
      notification: (
        await this.notificationRepository.create(newNotification)
      ).toDomain(),
    };
  }
}
