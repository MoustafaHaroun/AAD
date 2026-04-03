import { z } from 'zod';

export const listingSchema = {
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(1024),
};
