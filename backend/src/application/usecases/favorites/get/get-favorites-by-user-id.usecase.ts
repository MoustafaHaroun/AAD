import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from '@/infrastructure/persistence/typeorm/repositories/favorite.repository';
import {
  GetFavoritesByUserIdRequest,
  GetFavoritesByUserIdResponse,
} from '@/application/dto/favorites/get-favorites-by-user-id.dto';

@Injectable()
export class GetFavoritesByUserIdUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(
    dto: GetFavoritesByUserIdRequest,
  ): Promise<GetFavoritesByUserIdResponse> {
    const favorites = await this.favoriteRepository.findAllByUserId(dto.userId);

    return {
      favorites: favorites.map((f) => f.toDomain()),
    };
  }
}
