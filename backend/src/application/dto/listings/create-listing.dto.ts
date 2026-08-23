import { Listing } from '@/domain/entities';
import { z } from 'zod';
import { listingSchema } from '@/application/schemas';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

export const createListingSchema = z.object({
  title: listingSchema.title,
  description: listingSchema.description,
  category: listingSchema.category,
  type: listingSchema.type,
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

export type CreateListingRequest = z.infer<typeof createListingSchema>;

export class CreateListingResponse {
  listing: Listing;
}
