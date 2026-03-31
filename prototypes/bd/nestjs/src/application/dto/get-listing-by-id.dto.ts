import { Listing } from '@/domain/entities';

export type GetListingByIdRequest = {
  id: string;
};

export type GetListingByIdResponse = {
  listing: Listing;
};
