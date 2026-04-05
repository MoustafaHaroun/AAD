import { NotFoundException } from '@nestjs/common';
import { UpdateNotificationUseCase } from './update-notification.usecase';

const mockNotificationDomain = {
  id: 'notif-1',
  title: 'Updated',
  message: 'New message',
};

describe('UpdateNotificationUseCase', () => {
  let useCase: UpdateNotificationUseCase;
  const mockNotificationRepo = { findById: jest.fn(), update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateNotificationUseCase(mockNotificationRepo as any);
  });

  it('updates and returns the notification', async () => {
    const model = {
      id: 'notif-1',
      title: 'Old',
      message: 'Old message',
      toDomain: jest.fn().mockReturnValue(mockNotificationDomain),
    };
    mockNotificationRepo.findById.mockResolvedValue(model);
    mockNotificationRepo.update.mockResolvedValue(model);

    const result = await useCase.execute({
      id: 'notif-1',
      title: 'Updated',
      message: 'New message',
    });

    expect(model.title).toBe('Updated');
    expect(model.message).toBe('New message');
    expect(result).toEqual({ notification: mockNotificationDomain });
  });

  it('throws NotFoundException when notification does not exist', async () => {
    mockNotificationRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', title: 'X' }),
    ).rejects.toThrow(NotFoundException);
    expect(mockNotificationRepo.update).not.toHaveBeenCalled();
  });
});
