import { z } from 'zod';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

export const listingSchema = {
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(1024),
  category: z.enum(ListingCategory),
  type: z.enum(ListingType),
};
