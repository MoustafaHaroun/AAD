import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { DataSource } from 'typeorm';
import { MessageModel } from '@/infrastructure/persistence/typeorm/models/message.model';
import { NotificationModel } from '@/infrastructure/persistence/typeorm/models/notification.model';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import {
  CreateMessageRequest,
  CreateMessageResponse,
} from '@/application/dto/messages/create-message.dto';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    dto: CreateMessageRequest & { senderId: string },
  ): Promise<CreateMessageResponse> {
    const sender = await this.userRepository.findById(dto.senderId);

    if (sender == null) {
      throw new UnauthorizedException();
    }

    const recipient = await this.userRepository.findById(dto.recipientId);

    if (recipient == null) {
      throw new NotFoundException(
        `User with id '${dto.recipientId}' does not exist.`,
      );
    }

    const savedMessage = await this.dataSource.transaction(async (manager) => {
      const message = new MessageModel();
      message.id = v4();
      message.content = dto.content;
      message.sender = sender;
      message.recipient = recipient;

      const createdMessage = await manager.save(message);

      const notification = new NotificationModel();
      notification.id = v4();
      notification.title = `New message from ${sender.firstname} ${sender.surname}`;
      notification.message = dto.content.substring(0, 100);
      notification.user = recipient;

      await manager.save(notification);

      return createdMessage;
    });

    return {
      message: savedMessage.toDomain(),
    };
  }
}
