import { Notification } from '@/domain/entities';

export type GetNotificationByIdRequest = {
  id: string;
  requesterId?: string;
};

export type GetNotificationByIdResponse = {
  notification: Notification;
};
