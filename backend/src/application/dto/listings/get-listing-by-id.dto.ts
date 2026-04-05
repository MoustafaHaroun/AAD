import { Listing } from '@/domain/entities';
import { z } from 'zod';

export const getListingByIdSchema = z.object<Record<string, unknown>>({});

export type GetListingByIdRequest = z.infer<typeof getListingByIdSchema>;

export type GetListingByIdResponse = {
  listing: Listing;
};
