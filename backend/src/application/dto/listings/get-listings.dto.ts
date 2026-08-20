import { Listing, User } from '@/domain/entities';
import { z } from 'zod';

export const getListingsSchema = z.object({
  q: z.string().trim().min(1).optional(),
});

export type GetListingsRequest = z.infer<typeof getListingsSchema>;

export type PublicListing = Omit<Listing, 'user'> & {
  user: Pick<User, 'id' | 'firstname' | 'surname' | 'role'>;
};

export type GetListingsResponse = {
  listings: PublicListing[];
};
