import { Listing } from '@/domain/entities';
import { z } from 'zod';

export const getRandomListingsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type GetRandomListingsRequest = z.infer<typeof getRandomListingsSchema>;

export type GetRandomListingsResponse = {
  listings: Listing[];
};
