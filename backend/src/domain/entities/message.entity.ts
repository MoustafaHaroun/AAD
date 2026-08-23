import { User } from './user.entity';

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  sender: User;
  recipient: User;
}
