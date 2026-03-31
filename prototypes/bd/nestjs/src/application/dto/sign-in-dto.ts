import { ApiProperty } from '@nestjs/swagger';

export class SignInRequest {
  @ApiProperty({ example: 'timtimmerman@email.com' })
  email: string;

  @ApiProperty({ example: 'UnsafePassword123!' })
  password: string;
}

export class SignInResponse {
  token: string;
}
