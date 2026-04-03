import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from '@/presentation/controllers/notification.controller';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get-notification-by-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update-notification.usecase';
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
    UpdateNotificationUseCase,
  ],
  exports: [NotificationRepository],
})
export class NotificationModule {}
