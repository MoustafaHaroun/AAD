import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from '@/application/usecases/users/create-user.usecase';
import { GetUserByIdUseCase } from '@/application/usecases/users/get-user-by-id.usecase';
import { UpdateUserUseCase } from '@/application/usecases/users/update-user.usecase';
import { DeleteUserUseCase } from '@/application/usecases/users/delete-user.usecase';

const mockUser = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

describe('UserController', () => {
  let controller: UserController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockGetByIdUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUseCase },
        { provide: GetUserByIdUseCase, useValue: mockGetByIdUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteUserUseCase, useValue: mockDeleteUseCase },
      ],
    }).compile();

    controller = module.get(UserController);
  });

  it('createUser delegates to CreateUserUseCase', async () => {
    mockCreateUseCase.execute.mockResolvedValue({ user: mockUser });

    const result = await controller.createUser({
      email: 'test@test.com',
      password: 'pass',
      firstname: 'John',
      surname: 'Doe',
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

  it('updateUser delegates to UpdateUserUseCase with merged id', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({ user: mockUser });

    const result = await controller.updateUser('user-1', { firstname: 'Jane' });

    expect(result).toEqual({ user: mockUser });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: 'user-1',
      firstname: 'Jane',
    });
  });

  it('deleteUser delegates to DeleteUserUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteUser('user-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id: 'user-1' });
  });
});
