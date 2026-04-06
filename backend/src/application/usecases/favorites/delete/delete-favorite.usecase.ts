import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteRepository } from '@/infrastructure/persistence/typeorm/repositories/favorite.repository';
import {
  DeleteFavoriteRequest,
  DeleteFavoriteResponse,
} from '@/application/dto/favorites/delete-favorite.dto';

@Injectable()
export class DeleteFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute(dto: DeleteFavoriteRequest): Promise<DeleteFavoriteResponse> {
    const favorite = await this.favoriteRepository.findById(dto.id);

    if (favorite == null) {
      throw new NotFoundException(
        `Favorite with id '${dto.id}' does not exist.`,
      );
    }

    if (dto.requesterId && favorite.toDomain().user.id !== dto.requesterId) {
      throw new ForbiddenException(
        'You do not have permission to delete this favorite.',
      );
    }

    await this.favoriteRepository.delete(dto.id);
  }
}
