import { CreateNotificationUseCase } from './create-notification.usecase';

const mockNotificationDomain = {
  id: 'notif-1',
  title: 'Alert',
  message: 'Hello',
};

describe('CreateNotificationUseCase', () => {
  let useCase: CreateNotificationUseCase;
  const mockNotificationRepo = { create: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateNotificationUseCase(mockNotificationRepo as any);
  });

  it('creates and returns a notification', async () => {
    mockNotificationRepo.create.mockResolvedValue({
      toDomain: () => mockNotificationDomain,
    });

    const result = await useCase.execute({ title: 'Alert', message: 'Hello' });

    expect(result).toEqual({ notification: mockNotificationDomain });
    expect(mockNotificationRepo.create).toHaveBeenCalled();
  });
});
