import { Favorite } from '@/domain/entities/favorite.entity';

export type GetFavoritesByUserIdRequest = {
  userId: string;
};

export type GetFavoritesByUserIdResponse = {
  favorites: Favorite[];
};
