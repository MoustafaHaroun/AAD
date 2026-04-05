import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from '@/application/dto/notifications/update-notification.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';
import { NotificationModel } from '@/infrastructure/persistence/typeorm/models/notification.model';

@Injectable()
export class UpdateNotificationUseCase {
  constructor(
    private readonly NotificationRepository: NotificationRepository,
  ) {}

  async execute(
    dto: UpdateNotificationRequest & { id: string },
  ): Promise<UpdateNotificationResponse> {
    const notification: NotificationModel | null =
      await this.NotificationRepository.findById(dto.id);

    if (notification == null) {
      throw new NotFoundException(
        `Notification with id '${dto.id}' does not exist.`,
      );
    }

    if (dto.title != null) notification.title = dto.title;
    if (dto.message != null) notification.message = dto.message;

    return {
      notification: (
        await this.NotificationRepository.update(notification)
      ).toDomain(),
    };
  }
}
