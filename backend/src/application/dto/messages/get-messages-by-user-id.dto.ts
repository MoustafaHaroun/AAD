import { Message } from '@/domain/entities/message.entity';

export type GetMessagesByUserIdRequest = {
  userId: string;
};

export type GetMessagesByUserIdResponse = {
  messages: Message[];
};
