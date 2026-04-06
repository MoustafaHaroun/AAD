import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  GetNotificationByIdRequest,
  GetNotificationByIdResponse,
} from '@/application/dto/notifications/get-notification-by-id.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

@Injectable()
export class GetNotificationByIdUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(dto: GetNotificationByIdRequest): Promise<GetNotificationByIdResponse> {
    const notification = await this.notificationRepository.findById(dto.id);

    if (notification == null) {
      throw new NotFoundException(`Notification with id '${dto.id}' does not exist.`);
    }

    const domain = notification.toDomain();

    if (dto.requesterId && domain.user?.id !== dto.requesterId) {
      throw new ForbiddenException('You do not have access to this notification.');
    }

    return { notification: domain };
  }
}
