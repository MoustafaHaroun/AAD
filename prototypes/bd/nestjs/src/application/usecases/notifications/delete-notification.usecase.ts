import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeleteNotificationRequest,
  DeleteNotificationResponse,
} from '@/application/dto/notifications/delete-notification.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

@Injectable()
export class DeleteNotificationUseCase {
  constructor(
    private readonly NotificationRepository: NotificationRepository,
  ) {}

  async execute(
    dto: DeleteNotificationRequest,
  ): Promise<DeleteNotificationResponse> {
    const notification = await this.NotificationRepository.findById(dto.id);

    if (notification == null) {
      throw new NotFoundException(
        `Notification with id '${dto.id}' does not exist.`,
      );
    }

    await this.NotificationRepository.delete(dto.id);
  }
}
