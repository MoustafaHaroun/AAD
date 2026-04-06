import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DeleteNotificationRequest,
  DeleteNotificationResponse,
} from '@/application/dto/notifications/delete-notification.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(
    dto: DeleteNotificationRequest & { requesterId?: string },
  ): Promise<DeleteNotificationResponse> {
    const notification = await this.notificationRepository.findById(dto.id);

    if (notification == null) {
      throw new NotFoundException(`Notification with id '${dto.id}' does not exist.`);
    }

    const domain = notification.toDomain();

    if (dto.requesterId && domain.user?.id !== dto.requesterId) {
      throw new ForbiddenException('You do not have permission to delete this notification.');
    }

    await this.notificationRepository.delete(dto.id);
  }
}
