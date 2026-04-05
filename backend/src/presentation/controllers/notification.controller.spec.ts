import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@/presentation/guards/auth.guard';
import { NotificationController } from './notification.controller';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create/create-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get/get-notification-by-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update/update-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete/delete-notification.usecase';

const mockNotification = { id: 'notif-1', title: 'Alert', message: 'Hello' };

describe('NotificationController', () => {
  let controller: NotificationController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockGetByIdUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: CreateNotificationUseCase, useValue: mockCreateUseCase },
        { provide: GetNotificationByIdUseCase, useValue: mockGetByIdUseCase },
        { provide: UpdateNotificationUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteNotificationUseCase, useValue: mockDeleteUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(NotificationController);
  });

  it('getNotification delegates to GetNotificationByIdUseCase', async () => {
    mockGetByIdUseCase.execute.mockResolvedValue({
      notification: mockNotification,
    });

    const result = await controller.getNotification('notif-1');

    expect(result).toEqual({ notification: mockNotification });
    expect(mockGetByIdUseCase.execute).toHaveBeenCalledWith({ id: 'notif-1' });
  });

  it('createNotification delegates to CreateNotificationUseCase', async () => {
    mockCreateUseCase.execute.mockResolvedValue({
      notification: mockNotification,
    });

    const result = await controller.createNotification({
      title: 'Alert',
      message: 'Hello',
    });

    expect(result).toEqual({ notification: mockNotification });
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      title: 'Alert',
      message: 'Hello',
    });
  });

  it('updateNotification delegates to UpdateNotificationUseCase with merged id', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({
      notification: mockNotification,
    });

    const result = await controller.updateNotification('notif-1', {
      title: 'Updated',
    });

    expect(result).toEqual({ notification: mockNotification });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: 'notif-1',
      title: 'Updated',
    });
  });

  it('deleteNotification delegates to DeleteNotificationUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteNotification('notif-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id: 'notif-1' });
  });
});
