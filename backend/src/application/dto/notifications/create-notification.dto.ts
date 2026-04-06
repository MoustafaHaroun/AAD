import { z } from 'zod';
import { notificationSchema } from '@/application/schemas';
import { Notification } from '@/domain/entities';

export const createNotificationSchema = z.object({
  title: notificationSchema.title,
  message: notificationSchema.message,
});

export const createNotificationApi = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'My first notification',
      },
      message: {
        type: 'string',
        example: 'This is my first ever notification!',
      },
    },
  },
};

export type CreateNotificationRequest = z.infer<
  typeof createNotificationSchema
>;

export class CreateNotificationResponse {
  notification: Notification;
}
