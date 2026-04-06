import { NotFoundException } from '@nestjs/common';
import { GetNotificationByIdUseCase } from './get-notification-by-id.usecase';

const mockNotificationDomain = {
  id: 'notif-1',
  title: 'Alert',
  message: 'Hello',
};

describe('GetNotificationByIdUseCase', () => {
  let useCase: GetNotificationByIdUseCase;
  const mockNotificationRepo = { findById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetNotificationByIdUseCase(mockNotificationRepo as any);
  });

  it('returns the notification when found', async () => {
    mockNotificationRepo.findById.mockResolvedValue({
      toDomain: () => mockNotificationDomain,
    });

    const result = await useCase.execute({ id: 'notif-1' });

    expect(result).toEqual({ notification: mockNotificationDomain });
  });

  it('throws NotFoundException when notification does not exist', async () => {
    mockNotificationRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
