import { Injectable } from '@nestjs/common';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import {
  GetMessagesByUserIdRequest,
  GetMessagesByUserIdResponse,
} from '@/application/dto/messages/get-messages-by-user-id.dto';

@Injectable()
export class GetMessagesByUserIdUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(
    dto: GetMessagesByUserIdRequest,
  ): Promise<GetMessagesByUserIdResponse> {
    const messages = await this.messageRepository.findAllBySenderId(dto.userId);

    return {
      messages: messages.map((m) => m.toDomain()),
    };
  }
}
