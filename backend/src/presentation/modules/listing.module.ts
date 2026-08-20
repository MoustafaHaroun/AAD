import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingController } from '@/presentation/controllers';
import {
  AddAttachmentToListingUseCase,
  CreateListingUseCase,
  DeleteListingUseCase,
  GetListingByIdUseCase,
  GetListingsByUserIdUseCase,
  GetRandomListingsUseCase,
  UpdateListingUseCase,
  RemoveAttachmentFromListingUseCase,
} from '@/application/usecases';
import {
  AttachmentRepository,
  ListingRepository,
  UserRepository,
} from '@/infrastructure/persistence/typeorm/repositories';
import {
  AttachmentModel,
  ListingModel,
  UserModel,
} from '@/infrastructure/persistence/typeorm/models';
import { MinioClient } from '@/infrastructure/persistence/minio';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ListingModel, AttachmentModel]),
  ],
  controllers: [ListingController],
  providers: [
    ListingRepository,
    AttachmentRepository,
    UserRepository,
    AddAttachmentToListingUseCase,
    RemoveAttachmentFromListingUseCase,
    CreateListingUseCase,
    DeleteListingUseCase,
    GetListingByIdUseCase,
    GetListingsByUserIdUseCase,
    GetRandomListingsUseCase,
    UpdateListingUseCase,
    MinioClient,
  ],
  exports: [ListingRepository, AttachmentRepository, UserRepository],
})
export class ListingModule {}
