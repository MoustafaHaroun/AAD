import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflector } from '@nestjs/core';
import { UserController } from '@/presentation/controllers';
import {
  AddAvatarToUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  RemoveAvatarFromUserUseCase,
  UpdateUserUseCase,
} from '@/application/usecases';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { MinioClient } from '@/infrastructure/persistence/minio';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    UserRepository,
    CreateUserUseCase,
    GetAllUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    AddAvatarToUserUseCase,
    RemoveAvatarFromUserUseCase,
    MinioClient,
    RolesGuard,
    Reflector,
  ],
  exports: [UserRepository],
})
export class UserModule {}
