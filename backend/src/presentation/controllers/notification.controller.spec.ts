import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthGuard,
  AuthenticatedRequest,
} from '@/presentation/guards/auth.guard';
import { RolesGuard } from '@/presentation/guards/roles.guard';
import { NotificationController } from './notification.controller';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create/create-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get/get-notification-by-id.usecase';
import { GetNotificationsByUserIdUseCase } from '@/application/usecases/notifications/get/get-notifications-by-user-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update/update-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete/delete-notification.usecase';
import { Role } from '@/domain/enums/role.enum';

const mockNotification = { id: 'notif-1', title: 'Alert', message: 'Hello' };

const mockAuthReq = {
  user: { sub: 'user-1', email: 'test@test.com', role: Role.USER },
} as AuthenticatedRequest;

describe('NotificationController', () => {
  let controller: NotificationController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockGetByIdUseCase = { execute: jest.fn() };
  const mockGetByUserIdUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        { provide: CreateNotificationUseCase, useValue: mockCreateUseCase },
        { provide: GetNotificationByIdUseCase, useValue: mockGetByIdUseCase },
        {
          provide: GetNotificationsByUserIdUseCase,
          useValue: mockGetByUserIdUseCase,
        },
        { provide: UpdateNotificationUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteNotificationUseCase, useValue: mockDeleteUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(NotificationController);
  });

  it('getNotification passes requesterId to GetNotificationByIdUseCase', async () => {
    mockGetByIdUseCase.execute.mockResolvedValue({
      notification: mockNotification,
    });

    const result = await controller.getNotification(mockAuthReq, 'notif-1');

    expect(result).toEqual({ notification: mockNotification });
    expect(mockGetByIdUseCase.execute).toHaveBeenCalledWith({
      id: 'notif-1',
      requesterId: 'user-1',
    });
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

  it('getNotifications passes the authenticated user id to GetNotificationsByUserIdUseCase', async () => {
    mockGetByUserIdUseCase.execute.mockResolvedValue({
      notifications: [mockNotification],
    });

    const result = await controller.getNotifications(mockAuthReq);

    expect(result).toEqual({ notifications: [mockNotification] });
    expect(mockGetByUserIdUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
    });
  });

  it('updateNotification passes requesterId to UpdateNotificationUseCase', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({
      notification: mockNotification,
    });

    const result = await controller.updateNotification(mockAuthReq, 'notif-1', {
      read: true,
    });

    expect(result).toEqual({ notification: mockNotification });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      read: true,
      id: 'notif-1',
      requesterId: 'user-1',
    });
  });

  it('deleteNotification passes requesterId to DeleteNotificationUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteNotification(mockAuthReq, 'notif-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({
      id: 'notif-1',
      requesterId: 'user-1',
    });
  });
});
