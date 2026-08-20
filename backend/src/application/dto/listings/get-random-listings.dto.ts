import { z } from 'zod';
import { PublicListing } from '@/application/dto/listings/public-listing.dto';

export const getRandomListingsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});

export type GetRandomListingsRequest = z.infer<typeof getRandomListingsSchema>;

export type GetRandomListingsResponse = {
  listings: PublicListing[];
};
