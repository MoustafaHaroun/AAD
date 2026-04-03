import { ApiProperty } from '@nestjs/swagger';
import { Favorite } from '@/domain/entities/favorite.entity';

export class CreateFavoriteRequest {
  @ApiProperty({ example: 'listing-uuid' })
  listingId: string;
}

export class CreateFavoriteResponse {
  favorite: Favorite;
}
