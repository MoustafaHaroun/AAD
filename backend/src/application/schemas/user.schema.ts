import { z } from 'zod';

export const userSchema = {
  email: z.string().min(1).max(256),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character',
    }),
  firstname: z.string().min(1).max(128),
  surname: z.string().min(1).max(128),
  location: z.string().min(1).max(256),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
};
