import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@/domain/entities/message.entity';

export class CreateMessageRequest {
  @ApiProperty({ example: 'Can I come over to build the shed?' })
  content: string;

  @ApiProperty({ example: 'recipient-user-uuid' })
  recipientId: string;
}

export class CreateMessageResponse {
  message: Message;
}
