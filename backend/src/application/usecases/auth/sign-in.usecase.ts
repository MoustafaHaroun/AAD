import { Injectable } from '@nestjs/common';
import { AuthService } from '@/infrastructure/services';
import { SignInRequest, SignInResponse } from '@/application/dto';

@Injectable()
export class SignInUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: SignInRequest): Promise<SignInResponse> {
    return {
      token: await this.authService.signIn(dto.email, dto.password),
    };
  }
}
