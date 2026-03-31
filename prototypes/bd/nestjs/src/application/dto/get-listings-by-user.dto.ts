import { Listing } from '@/domain/entities';

export type GetListingsByUserRequest = {
  userId: string;
};

export type GetListingsByUserResponse = {
  listings: Listing[];
};
