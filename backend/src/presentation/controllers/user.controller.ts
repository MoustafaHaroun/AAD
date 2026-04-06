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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
} from '@/application/usecases';
import {
  createUserApi,
  createUserSchema,
  type CreateUserRequest,
  type CreateUserResponse,
  type DeleteUserResponse,
  type GetAllUsersResponse,
  type GetUserByIdResponse,
  type UpdateUserRequest,
  type UpdateUserResponse,
  updateUserApi,
  updateUserSchema,
} from '@/application/dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '@/infrastructure/validation/zod.pipe';
import * as authGuard from '@/presentation/guards/auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { Roles } from '@/presentation/decorators/roles.decorator';
import { Role } from '@/domain/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(authGuard.AuthGuard, RolesGuard)
  @ApiBearerAuth()
  getAllUsers(): Promise<GetAllUsersResponse> {
    return this.getAllUsersUseCase.execute();
  }

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
  @UseGuards(authGuard.AuthGuard)
  @ApiBearerAuth()
  @ApiBody(updateUserApi)
  updateUser(
    @Req() request: authGuard.AuthenticatedRequest,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserSchema)) dto: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.updateUserUseCase.execute({
      ...dto,
      id,
      requesterId: authGuard.getRequesterId(request),
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @UseGuards(authGuard.AuthGuard, RolesGuard)
  @ApiBearerAuth()
  deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
    return this.deleteUserUseCase.execute({ id });
  }
}
