import { User } from './user.entity';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  user?: User;
}
