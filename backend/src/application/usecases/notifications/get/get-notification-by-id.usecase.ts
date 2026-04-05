import {
  GetNotificationByIdRequest,
  GetNotificationByIdResponse,
} from '@/application/dto/notifications/get-notification-by-id.dto';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetNotificationByIdUseCase {
  constructor(
    private readonly NotificationRepository: NotificationRepository,
  ) {}

  async execute(
    dto: GetNotificationByIdRequest,
  ): Promise<GetNotificationByIdResponse> {
    const Notification = await this.NotificationRepository.findById(dto.id);

    return {
      notification: Notification != null ? Notification.toDomain() : null,
    };
  }
}
