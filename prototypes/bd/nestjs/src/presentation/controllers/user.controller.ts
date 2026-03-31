import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '@/application/usecases';
import {
  CreateUserRequest,
  type CreateUserResponse,
  type DeleteUserResponse,
  type GetUserByIdResponse,
  UpdateUserRequest,
  type UpdateUserResponse,
} from '@/application/dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
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

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBody({ type: UpdateUserRequest })
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.updateUserUseCase.execute({ ...dto, id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
    return this.deleteUserUseCase.execute({ id });
  }
}
