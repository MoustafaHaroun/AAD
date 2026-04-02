import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/domain/entities';

export class UpdateUserRequest {
  @ApiProperty({ example: 'Tim', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Timmerman', required: false })
  surname?: string;

  @ApiProperty({ example: 'timmerman@email.com', required: false })
  email?: string;
}

export class UpdateUserResponse {
  user: User;
}
