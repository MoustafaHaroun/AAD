import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import {
  signInApi,
  type SignInRequest,
  type SignInResponse,
  signInSchema,
} from '@/application/dto';
import { SignInUseCase } from '@/application/usecases';
import { ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';

@Controller('auth')
export class AuthController {
  constructor(private signInUseCase: SignInUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @UsePipes(new ZodValidationPipe(signInSchema))
  @ApiBody(signInApi)
  signIn(@Body() dto: SignInRequest): Promise<SignInResponse> {
    return this.signInUseCase.execute(dto);
  }
}
