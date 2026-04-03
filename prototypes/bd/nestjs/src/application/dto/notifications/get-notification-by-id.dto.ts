import { Notification } from '@/domain/entities';

export type GetNotificationByIdRequest = {
  id: string;
};

export type GetNotificationByIdResponse = {
  notification: Notification | null;
};
