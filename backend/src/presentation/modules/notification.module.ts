import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from '@/presentation/controllers/notification.controller';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create/create-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete/delete-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get/get-notification-by-id.usecase';
import { GetNotificationsByUserIdUseCase } from '@/application/usecases/notifications/get/get-notifications-by-user-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update/update-notification.usecase';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';
import { NotificationModel } from '@/infrastructure/persistence/typeorm/models/notification.model';
import { UserModel } from '@/infrastructure/persistence/typeorm/models';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationModel, UserModel])],
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    CreateNotificationUseCase,
    DeleteNotificationUseCase,
    GetNotificationByIdUseCase,
    GetNotificationsByUserIdUseCase,
    UpdateNotificationUseCase,
    RolesGuard,
    Reflector,
  ],
  exports: [NotificationRepository],
})
export class NotificationModule {}
