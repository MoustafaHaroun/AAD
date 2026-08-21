import { Listing } from '@/domain/entities';
import { Notification } from '@/domain/entities/notification.entity';
import { Role } from '@/domain/enums/role.enum';

export interface User {
  id: string;
  email: string;
  firstname: string;
  surname: string;
  role: Role;
  location: string | null;
  avatar: string | null;
  listings: Listing[];
  notifications: Notification[];
}
