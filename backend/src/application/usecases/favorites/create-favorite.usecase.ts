import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { v4 } from 'uuid';
import { FavoriteModel } from '@/infrastructure/persistence/typeorm/models/favorite.model';
import { FavoriteRepository } from '@/infrastructure/persistence/typeorm/repositories/favorite.repository';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories/listing.repository';
import {
  CreateFavoriteRequest,
  CreateFavoriteResponse,
} from '@/application/dto/favorites/create-favorite.dto';

@Injectable()
export class CreateFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly userRepository: UserRepository,
    private readonly listingRepository: ListingRepository,
  ) {}

  async execute(
    dto: CreateFavoriteRequest & { userId: string },
  ): Promise<CreateFavoriteResponse> {
    const user = await this.userRepository.findById(dto.userId);

    if (user == null) {
      throw new UnauthorizedException();
    }

    const listing = await this.listingRepository.findById(dto.listingId);

    if (listing == null) {
      throw new NotFoundException(
        `Listing with id '${dto.listingId}' does not exist.`,
      );
    }

    const favorite = new FavoriteModel();

    favorite.id = v4();
    favorite.user = user;
    favorite.listing = listing;

    return {
      favorite: (await this.favoriteRepository.create(favorite)).toDomain(),
    };
  }
}
