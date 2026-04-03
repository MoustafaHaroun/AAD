import { z } from 'zod';
import { userSchema } from '@/application/schemas';

export const signInSchema = z.object({
  email: userSchema.email,
  password: userSchema.password,
});

export const signInApi = {
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
    },
    required: ['email', 'password'],
  },
};

export type SignInRequest = z.infer<typeof signInSchema>;

export class SignInResponse {
  token: string;
}
