import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/domain/entities';

export class UpdateUserRequest {
  @ApiProperty({ example: 'Tim', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Timmerman', required: false })
  surname?: string;
}

export class UpdateUserResponse {
  user: User;
}
