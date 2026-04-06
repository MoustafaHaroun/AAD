import { Message } from '@/domain/entities/message.entity';

export type GetMessageByIdRequest = {
  id: string;
  requesterId?: string;
};

export type GetMessageByIdResponse = {
  message: Message;
};
