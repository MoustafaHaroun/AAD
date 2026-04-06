import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import {
  GetMessageByIdRequest,
  GetMessageByIdResponse,
} from '@/application/dto/messages/get-message-by-id.dto';

@Injectable()
export class GetMessageByIdUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(dto: GetMessageByIdRequest): Promise<GetMessageByIdResponse> {
    const message = await this.messageRepository.findById(dto.id);

    if (message == null) {
      throw new NotFoundException(`Message with id '${dto.id}' does not exist.`);
    }

    const domain = message.toDomain();

    if (
      dto.requesterId &&
      domain.sender.id !== dto.requesterId &&
      domain.recipient.id !== dto.requesterId
    ) {
      throw new ForbiddenException('You do not have access to this message.');
    }

    return { message: domain };
  }
}
