import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@/domain/entities';

export class CreateNotificationRequest {
  @ApiProperty({ example: 'My first notification' })
  title: string;

  @ApiProperty({ example: 'This is my first ever notification!' })
  message: string;
}

export class CreateNotificationResponse {
  notification: Notification;
}
