import { User } from '@/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty({
    example: "timtimmerman@email.com",
  })
  email: string;

  @ApiProperty({
    example: "UnsafePassword123!",
  })
  password: string;

  @ApiProperty({
    example: "Tim",
  })
  firstname: string;

  @ApiProperty({
    example: "Timmerman",
  })
  surname: string;
}

export class CreateUserResponse {
  user: User
}
