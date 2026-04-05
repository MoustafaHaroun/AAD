import { NotFoundException } from '@nestjs/common';
import { DeleteUserUseCase } from './delete-user.usecase';

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;
  const mockUserRepo = { findById: jest.fn(), delete: jest.fn() };
  const mockManager = {
    find: jest.fn().mockResolvedValue([]),
    delete: jest.fn(),
  };
  const mockDataSource = {
    transaction: jest
      .fn()
      .mockImplementation(async (cb: any) => cb(mockManager)),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockManager.find.mockResolvedValue([]);
    mockDataSource.transaction.mockImplementation(async (cb: any) =>
      cb(mockManager),
    );
    useCase = new DeleteUserUseCase(mockUserRepo as any, mockDataSource as any);
  });

  it('deletes the user when found', async () => {
    mockUserRepo.findById.mockResolvedValue({ id: 'user-1' });
    mockUserRepo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'user-1' })).resolves.toBeUndefined();
    expect(mockDataSource.transaction).toHaveBeenCalled();
  });

  it('throws NotFoundException when user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockUserRepo.delete).not.toHaveBeenCalled();
  });
});
