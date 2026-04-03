import { Injectable } from '@nestjs/common';
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

    return {
      message: message != null ? message.toDomain() : null,
    };
  }
}
