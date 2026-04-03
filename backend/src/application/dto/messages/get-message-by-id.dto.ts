import { Message } from '@/domain/entities/message.entity';

export type GetMessageByIdRequest = {
  id: string;
};

export type GetMessageByIdResponse = {
  message: Message | null;
};
