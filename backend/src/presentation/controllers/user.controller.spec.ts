import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '@/application/usecases/users/create/create-user.usecase';
import { GetAllUsersUseCase } from '@/application/usecases/users/get/get-all-users.usecase';
import { GetUserByIdUseCase } from '@/application/usecases/users/get/get-user-by-id.usecase';
import { UpdateUserUseCase } from '@/application/usecases/users/patch/update-user.usecase';
import { DeleteUserUseCase } from '@/application/usecases/users/delete/delete-user.usecase';
import {
  AuthGuard,
  AuthenticatedRequest,
} from '@/presentation/guards/auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { Role } from '@/domain/enums/role.enum';

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

const mockAuthReq = {
  user: { sub: 'user-1', email: 'test@test.com', role: Role.USER },
} as AuthenticatedRequest;

describe('UserController', () => {
  let controller: UserController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockGetAllUsersUseCase = { execute: jest.fn() };
  const mockGetByIdUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUseCase },
        { provide: GetAllUsersUseCase, useValue: mockGetAllUsersUseCase },
        { provide: GetUserByIdUseCase, useValue: mockGetByIdUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteUserUseCase, useValue: mockDeleteUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(UserController);
  });

  it('createUser delegates to CreateUserUseCase', async () => {
    mockCreateUseCase.execute.mockResolvedValue({ user: mockUser });

    const result = await controller.createUser({
      email: 'test@test.com',
      password: 'pass',
      firstname: 'John',
      surname: 'Doe',
      location: 'Enschede, Saxion',
      role: Role.ADMIN,
    });

    expect(result).toEqual({ user: mockUser });
    expect(mockCreateUseCase.execute).toHaveBeenCalled();
  });

  it('getUser delegates to GetUserByIdUseCase', async () => {
    mockGetByIdUseCase.execute.mockResolvedValue({ user: mockUser });

    const result = await controller.getUser('user-1');

    expect(result).toEqual({ user: mockUser });
    expect(mockGetByIdUseCase.execute).toHaveBeenCalledWith({ id: 'user-1' });
  });

  it('updateUser passes requesterId and merged id to UpdateUserUseCase', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({ user: mockUser });

    const result = await controller.updateUser(mockAuthReq, 'user-1', {
      firstname: 'Jane',
    });

    expect(result).toEqual({ user: mockUser });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: 'user-1',
      firstname: 'Jane',
      requesterId: 'user-1',
    });
  });

  it('deleteUser delegates to DeleteUserUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteUser('user-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id: 'user-1' });
  });
});
