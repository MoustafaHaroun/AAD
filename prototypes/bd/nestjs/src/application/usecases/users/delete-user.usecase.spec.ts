import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.usecase';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  const mockUserRepo = { findById: jest.fn(), delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteUserUseCase(mockUserRepo as any);
  });

  it('deletes the user when found', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1' });
    mockUserRepo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'user-1' })).resolves.toBeUndefined();
    expect(mockUserRepo.delete).toHaveBeenCalledWith('user-1');
  });

  it('throws NotFoundException when user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepo.delete).not.toHaveBeenCalled();
  });
});
