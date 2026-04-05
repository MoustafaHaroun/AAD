import { ConflictException } from '@nestjs/common';
import { CreateUserUseCase } from './create-user.usecase';

const mockUserDomain = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

const mockUserModel = { toDomain: jest.fn().mockReturnValue(mockUserDomain) };

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  const mockUserRepo = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateUserUseCase(mockUserRepo as any);
  });

  it('creates and returns a new user', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue(mockUserModel);

    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'pass',
      firstname: 'John',
      surname: 'Doe',
    });

    expect(result).toEqual({ user: mockUserDomain });
    expect(mockUserRepo.create).toHaveBeenCalled();
  });

  it('throws ConflictException when email already exists', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUserModel);

    await expect(
      useCase.execute({
        email: 'test@test.com',
        password: 'pass',
        firstname: 'John',
        surname: 'Doe',
      }),
    ).rejects.toThrow(ConflictException);
    expect(mockUserRepo.create).not.toHaveBeenCalled();
  });
});
