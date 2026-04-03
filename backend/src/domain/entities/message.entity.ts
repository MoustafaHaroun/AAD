import { User } from './user.entity';

export interface Message {
  id: string;
  content: string;
  sender: User;
  recipient: User;
}
