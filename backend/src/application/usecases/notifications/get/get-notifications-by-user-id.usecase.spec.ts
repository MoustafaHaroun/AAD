import { GetNotificationsByUserIdUseCase } from './get-notifications-by-user-id.usecase';

const mockNotificationDomain = {
  id: 'notif-1',
  title: 'New message from Jane',
  message: 'Hey there!',
  read: false,
  createdAt: new Date('2026-01-01'),
  user: { id: 'user-1' },
};

describe('GetNotificationsByUserIdUseCase', () => {
  let useCase: GetNotificationsByUserIdUseCase;
  const mockNotificationRepo = { findAllByUserId: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetNotificationsByUserIdUseCase(mockNotificationRepo as any);
  });

  it('returns mapped notifications for a user', async () => {
    mockNotificationRepo.findAllByUserId.mockResolvedValue([
      { toDomain: () => mockNotificationDomain },
    ]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual({ notifications: [mockNotificationDomain] });
    expect(mockNotificationRepo.findAllByUserId).toHaveBeenCalledWith('user-1');
  });

  it('returns empty array when user has no notifications', async () => {
    mockNotificationRepo.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual({ notifications: [] });
  });
});
