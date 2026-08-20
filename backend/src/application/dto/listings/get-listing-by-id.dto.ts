import { z } from 'zod';
import { PublicListing } from '@/application/dto/listings/public-listing.dto';

export const getListingByIdSchema = z.object<Record<string, unknown>>({});

export type GetListingByIdRequest = z.infer<typeof getListingByIdSchema>;

export type GetListingByIdResponse = {
  listing: PublicListing;
};
