import { z } from 'zod';
import { PublicListing } from '@/application/dto/listings/public-listing.dto';

export const getListingsSchema = z.object({
  q: z.string().trim().min(1).optional(),
});

export type GetListingsRequest = z.infer<typeof getListingsSchema>;

export type GetListingsResponse = {
  listings: PublicListing[];
};
