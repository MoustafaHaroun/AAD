import { User } from '@/domain/entities';
import { imageSchema } from '@/application/schemas/image.schema';
import { z } from 'zod';

export const addAvatarToUserSchema = z.object({
  binary: imageSchema,
});

export const addAvatarToUserApi = {
  schema: {
    type: 'object',
    properties: {
      binary: { type: 'string', format: 'binary' },
    },
  },
};

export type AddAvatarToUserRequest = z.infer<typeof addAvatarToUserSchema>;

export class AddAvatarToUserResponse {
  user: User;
}
