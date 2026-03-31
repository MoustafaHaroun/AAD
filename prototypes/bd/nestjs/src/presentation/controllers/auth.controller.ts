import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInRequest, type SignInResponse } from '@/application/dto';
import { SignInUseCase } from '@/application/usecases';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private signInUseCase: SignInUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiBody({ type: SignInRequest })
  signIn(@Body() dto: SignInRequest): Promise<SignInResponse> {
    return this.signInUseCase.execute(dto);
  }
}
