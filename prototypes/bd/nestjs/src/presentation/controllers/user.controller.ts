import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserUseCase, GetUserByIdUseCase } from '@/application/usecases';
import {
  CreateUserRequest,
  type CreateUserResponse,
  type GetUserByIdResponse,
} from '@/application/dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiBody({ type: CreateUserRequest })
  createUser(@Body() dto: CreateUserRequest): Promise<CreateUserResponse> {
    return this.createUserUseCase.execute(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<GetUserByIdResponse> {
    return this.getUserByIdUseCase.execute({ id });
  }
}
