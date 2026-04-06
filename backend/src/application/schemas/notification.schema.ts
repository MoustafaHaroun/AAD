import { z } from 'zod';

export const notificationSchema = {
  title: z.string().min(1).max(128),
  message: z.string().min(1).max(1024),
};
