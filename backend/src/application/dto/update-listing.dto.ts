import { Listing } from '@/domain/entities';
import { z } from 'zod';
import { listingSchema } from '@/application/schemas';

export const updateListingSchema = z.object({
  title: listingSchema.title.optional(),
  description: listingSchema.description.optional(),
});

export const updateListingApi = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'My First Listing (Edited)',
      },
      description: {
        type: 'string',
        example: 'The title and description of this listing were edited.',
      },
    },
  },
};

export type UpdateListingRequest = z.infer<typeof updateListingSchema>;

export class UpdateListingResponse {
  listing: Listing;
}
