import { z } from 'zod';
import { messageSchema } from '@/application/schemas';
import { Message } from '@/domain/entities/message.entity';

export const createMessageSchema = z.object({
  content: messageSchema.content,
  recipientId: messageSchema.recipientId,
});

export const createMessageApi = {
  schema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        example: 'Can I come over to build the shed?',
      },
      recipientId: {
        type: 'string',
        format: 'uuid',
        example: 'recipient-user-uuid',
      },
    },
  },
};

export type CreateMessageRequest = z.infer<typeof createMessageSchema>;

export class CreateMessageResponse {
  message: Message;
}
