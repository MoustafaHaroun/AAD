import { Listing } from '@/domain/entities';
import { Notification } from '@/domain/entities/notification.entity';

export interface User {
  id: string;
  email: string;
  firstname: string;
  surname: string;
  listings: Listing[];
  notifications: Notification[];
}
