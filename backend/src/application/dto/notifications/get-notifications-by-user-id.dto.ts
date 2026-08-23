import { Notification } from '@/domain/entities';

export type GetNotificationsByUserIdRequest = {
  userId: string;
};

export type GetNotificationsByUserIdResponse = {
  notifications: Notification[];
};
