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
  createUserApi,
  createUserSchema,
  type CreateUserRequest,
  type CreateUserResponse,
  type DeleteUserResponse,
  type GetUserByIdResponse,
  type UpdateUserRequest,
  type UpdateUserResponse,
  updateUserApi,
  updateUserSchema,
} from '@/application/dto';
import { ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';

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
  @ApiBody(createUserApi)
  createUser(
    @Body(new ZodValidationPipe(createUserSchema)) dto: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.createUserUseCase.execute(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<GetUserByIdResponse> {
    return this.getUserByIdUseCase.execute({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiBody(updateUserApi)
  updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.updateUserUseCase.execute({ ...dto, id });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
    return this.deleteUserUseCase.execute({ id });
  }
}
