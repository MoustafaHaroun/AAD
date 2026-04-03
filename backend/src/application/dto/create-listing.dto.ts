import { Listing } from '@/domain/entities';
import { z } from 'zod';
import { listingSchema } from '@/application/schemas';

export const createListingSchema = z.object({
  title: listingSchema.title,
  description: listingSchema.description,
});

export const createListingApi = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'My First Listing',
      },
      description: {
        type: 'string',
        example: 'This is my first ever listing!!',
      },
    },
  },
};

export type CreateListingRequest = z.infer<typeof createListingSchema>;

export class CreateListingResponse {
  listing: Listing;
}
