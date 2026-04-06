import { NotFoundException } from '@nestjs/common';
import { DeleteNotificationUseCase } from './delete-notification.usecase';

describe('DeleteNotificationUseCase', () => {
  let useCase: DeleteNotificationUseCase;
  const mockNotificationRepo = { findById: jest.fn(), delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteNotificationUseCase(mockNotificationRepo as any);
  });

  it('deletes the notification when found', async () => {
    mockNotificationRepo.findById.mockResolvedValue({
      id: 'notif-1',
      toDomain: jest.fn().mockReturnValue({
        id: 'notif-1',
        title: 'Alert',
        message: 'Hello',
        user: null,
      }),
    });
    mockNotificationRepo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'notif-1' })).resolves.toBeUndefined();
    expect(mockNotificationRepo.delete).toHaveBeenCalledWith('notif-1');
  });

  it('throws NotFoundException when notification does not exist', async () => {
    mockNotificationRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockNotificationRepo.delete).not.toHaveBeenCalled();
  });
});
