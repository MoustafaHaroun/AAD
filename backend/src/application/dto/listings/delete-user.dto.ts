import { z } from 'zod';

export const deleteUserSchema = z.object<Record<string, unknown>>({});

export type DeleteUserRequest = z.infer<typeof deleteUserSchema>;

export type DeleteUserResponse = void;
