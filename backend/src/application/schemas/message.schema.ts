import { z } from 'zod';

export const messageSchema = {
  content: z.string().min(1).max(2048),
  recipientId: z.string().uuid(),
};
