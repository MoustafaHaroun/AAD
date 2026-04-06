import { z } from 'zod';
import { Favorite } from '@/domain/entities/favorite.entity';

export const createFavoriteSchema = z.object({
  listingId: z.string().uuid(),
});

export const createFavoriteApi = {
  schema: {
    type: 'object',
    properties: {
      listingId: {
        type: 'string',
        format: 'uuid',
        example: 'listing-uuid',
      },
    },
  },
};

export type CreateFavoriteRequest = z.infer<typeof createFavoriteSchema>;

export class CreateFavoriteResponse {
  favorite: Favorite;
}
