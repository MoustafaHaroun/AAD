import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController } from '@/presentation/controllers/message.controller';
import { CreateMessageUseCase } from '@/application/usecases/messages/create-message.usecase';
import { GetMessageByIdUseCase } from '@/application/usecases/messages/get-message-by-id.usecase';
import { GetMessagesByUserIdUseCase } from '@/application/usecases/messages/get-messages-by-user-id.usecase';
import { DeleteMessageUseCase } from '@/application/usecases/messages/delete-message.usecase';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { MessageModel } from '@/infrastructure/persistence/typeorm/models/message.model';
import { UserModel } from '@/infrastructure/persistence/typeorm/models/user.model';

@Module({
  imports: [TypeOrmModule.forFeature([MessageModel, UserModel])],
  controllers: [MessageController],
  providers: [
    MessageRepository,
    UserRepository,
    CreateMessageUseCase,
    GetMessageByIdUseCase,
    GetMessagesByUserIdUseCase,
    DeleteMessageUseCase,
  ],
  exports: [MessageRepository],
})
export class MessageModule {}
