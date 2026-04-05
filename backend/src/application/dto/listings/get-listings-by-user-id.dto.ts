import { Listing } from '@/domain/entities';
import { z } from 'zod';

export const getListingsByUserIdSchema = z.object<Record<string, unknown>>({});

export type GetListingsByUserIdRequest = z.infer<
  typeof getListingsByUserIdSchema
>;

export type GetListingsByUserIdResponse = {
  listings: Listing[];
};
