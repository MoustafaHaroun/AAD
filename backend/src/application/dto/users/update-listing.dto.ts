import { Listing } from '@/domain/entities';
import { z } from 'zod';
import { listingSchema } from '@/application/schemas';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

export const updateListingSchema = z.object({
  title: listingSchema.title.optional(),
  description: listingSchema.description.optional(),
  category: listingSchema.category.optional(),
  type: listingSchema.type.optional(),
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
      category: {
        type: 'string',
        enum: Object.values(ListingCategory),
        example: ListingCategory.OTHER,
      },
      type: {
        type: 'string',
        enum: Object.values(ListingType),
        example: ListingType.OFFER,
      },
    },
  },
};

export type UpdateListingRequest = z.infer<typeof updateListingSchema>;

export class UpdateListingResponse {
  listing: Listing;
}
