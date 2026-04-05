import { User } from '@/domain/entities';
import { z } from 'zod';
import { userSchema } from '@/application/schemas/user.schema';
import { Role } from '@/domain/enums/role.enum';

export const createUserSchema = z.object({
  email: userSchema.email,
  password: userSchema.password,
  firstname: userSchema.firstname,
  surname: userSchema.surname,
  role: z.nativeEnum(Role).optional().default(Role.USER),
  location: userSchema.location.nullable().optional().default(null),
});

export const createUserApi = {
  schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        example: 'timtimmerman@email.com',
      },
      password: {
        type: 'string',
        format: 'password',
        example: 'UnsafePassword123!',
      },
      firstname: {
        type: 'string',
        example: 'Tim',
      },
      surname: {
        type: 'string',
        example: 'Timmerman',
      },
      role: {
        type: 'string',
        example: 'user',
      },
      location: {
        type: 'string',
        example: 'Enschede, Nederland',
      },
    },
    required: ['email', 'password', 'firstname', 'surname'],
  },
};

export type CreateUserRequest = z.infer<typeof createUserSchema>;

export class CreateUserResponse {
  user: User;
}
