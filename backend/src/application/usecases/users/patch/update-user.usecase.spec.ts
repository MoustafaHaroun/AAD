import { NotFoundException } from '@nestjs/common';
import { UpdateUserUseCase } from './update-user.usecase';

const mockUserDomain = {
  id: 'user-1',
  email: 'updated@test.com',
  firstname: 'Jane',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
  const mockUserRepo = { findById: jest.fn(), update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateUserUseCase(mockUserRepo as any);
  });

  it('updates and returns the user', async () => {
    const model = {
      id: 'user-1',
      email: 'old@test.com',
      firstname: 'John',
      surname: 'Doe',
      toDomain: jest.fn().mockReturnValue(mockUserDomain),
    };
    mockUserRepo.findById.mockResolvedValue(model);
    mockUserRepo.update.mockResolvedValue(model);

    const result = await useCase.execute({
      id: 'user-1',
      firstname: 'Jane',
      email: 'updated@test.com',
    });

    expect(model.firstname).toBe('Jane');
    expect(model.email).toBe('updated@test.com');
    expect(result).toEqual({ user: mockUserDomain });
  });

  it('throws NotFoundException when user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', firstname: 'Jane' }),
    ).rejects.toThrow(NotFoundException);
    expect(mockUserRepo.update).not.toHaveBeenCalled();
  });
});
