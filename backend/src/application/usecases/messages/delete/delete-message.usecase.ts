import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import {
  DeleteMessageRequest,
  DeleteMessageResponse,
} from '@/application/dto/messages/delete-message.dto';

@Injectable()
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(
    dto: DeleteMessageRequest & { requesterId?: string },
  ): Promise<DeleteMessageResponse> {
    const message = await this.messageRepository.findById(dto.id);

    if (message == null) {
      throw new NotFoundException(
        `Message with id '${dto.id}' does not exist.`,
      );
    }

    const domain = message.toDomain();

    if (
      dto.requesterId &&
      domain.sender.id !== dto.requesterId &&
      domain.recipient.id !== dto.requesterId
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this message.',
      );
    }

    await this.messageRepository.delete(dto.id);
  }
}
