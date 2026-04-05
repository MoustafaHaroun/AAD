import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '@/infrastructure/persistence/typeorm/repositories/message.repository';
import {
  DeleteMessageRequest,
  DeleteMessageResponse,
} from '@/application/dto/messages/delete-message.dto';

@Injectable()
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(dto: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    const message = await this.messageRepository.findById(dto.id);

    if (message == null) {
      throw new NotFoundException(
        `Message with id '${dto.id}' does not exist.`,
      );
    }

    await this.messageRepository.delete(dto.id);
  }
}
