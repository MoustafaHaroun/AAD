import { User } from '@/domain/entities';
import { z } from 'zod';

export const getUserByIdSchema = z.object<Record<string, unknown>>({});

export type GetUserByIdRequest = z.infer<typeof getUserByIdSchema>;

export type GetUserByIdResponse = {
  user: User | null;
};
