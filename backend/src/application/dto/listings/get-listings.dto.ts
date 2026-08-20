import { Listing } from '@/domain/entities';
import { z } from 'zod';

export const getListingsSchema = z.object({
  q: z.string().trim().min(1).optional(),
});

export type GetListingsRequest = z.infer<typeof getListingsSchema>;

export type GetListingsResponse = {
  listings: Listing[];
};
