import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { v4 } from 'uuid';
import { MessageModel } from '@/infrastructure/persistence/typeorm/models/message.model';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import {
  CreateMessageRequest,
  CreateMessageResponse,
} from '@/application/dto/messages/create-message.dto';

@Injectable()
export class CreateMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
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

    const message = new MessageModel();

    message.id = v4();
    message.content = dto.content;
    message.sender = sender;
    message.recipient = recipient;

    return {
      message: (await this.messageRepository.create(message)).toDomain(),
    };
  }
}
