import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteController } from '@/presentation/controllers/favorite.controller';
import { CreateFavoriteUseCase } from '@/application/usecases/favorites/create-favorite.usecase';
import { GetFavoritesByUserIdUseCase } from '@/application/usecases/favorites/get-favorites-by-user-id.usecase';
import { DeleteFavoriteUseCase } from '@/application/usecases/favorites/delete-favorite.usecase';
import { FavoriteRepository } from '@/infrastructure/persistence/typeorm/repositories/favorite.repository';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories/listing.repository';
import { FavoriteModel } from '@/infrastructure/persistence/typeorm/models/favorite.model';
import { UserModel } from '@/infrastructure/persistence/typeorm/models/user.model';
import { ListingModel } from '@/infrastructure/persistence/typeorm/models/listing.model';
import { AttachmentModel } from '@/infrastructure/persistence/typeorm/models/attachment.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteModel, UserModel, ListingModel, AttachmentModel]),
  ],
  controllers: [FavoriteController],
  providers: [
    FavoriteRepository,
    UserRepository,
    ListingRepository,
    CreateFavoriteUseCase,
    GetFavoritesByUserIdUseCase,
    DeleteFavoriteUseCase,
  ],
  exports: [FavoriteRepository],
})
export class FavoriteModule {}
