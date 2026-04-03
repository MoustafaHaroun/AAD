import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '@/infrastructure/persistence/typeorm/models/user.model';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models/listing.model';
import { Favorite } from '@/domain/entities/favorite.entity';

@Entity('favorites')
export class FavoriteModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserModel)
  user: UserModel;

  @ManyToOne(() => ListingModel)
  listing: ListingModel;

  toDomain(): Favorite {
    return {
      id: this.id,
      user: this.user.toDomain(),
      listing: this.listing.toDomain(),
    } satisfies Favorite;
  }
}
