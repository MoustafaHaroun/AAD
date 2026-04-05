import { User } from '@/domain/entities';
import { z } from 'zod';
import { userSchema } from '@/application/schemas';

export const updateUserSchema = z.object({
  email: userSchema.email.optional(),
  firstname: userSchema.firstname.optional(),
  surname: userSchema.surname.optional(),
  location: userSchema.location.nullable().optional(),
});

export const updateUserApi = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'timtimmerman@email.com',
      },
      firstname: {
        type: 'string',
        example: 'Tim',
      },
      surname: {
        type: 'string',
        example: 'Timmerman',
      },
      location: {
        type: 'string',
        nullable: true,
        example: 'Brussels, Belgium',
      },
    },
  },
};

export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

export class UpdateUserResponse {
  user: User;
}
