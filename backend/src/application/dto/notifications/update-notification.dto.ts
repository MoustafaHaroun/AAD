import { Notification } from '@/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationRequest {
  @ApiProperty({ example: 'My updated notification', required: false })
  title?: string;

  @ApiProperty({ example: 'An updated description.', required: false })
  message?: string | null;

  @ApiProperty({ example: true, required: false })
  read?: boolean;
}

export class UpdateNotificationResponse {
  notification: Notification;
}
