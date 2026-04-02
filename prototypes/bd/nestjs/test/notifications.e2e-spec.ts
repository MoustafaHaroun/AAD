import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { NotificationController } from '@/presentation/controllers/notification.controller';
import { CreateNotificationUseCase } from '@/application/usecases/notifications/create-notification.usecase';
import { GetNotificationByIdUseCase } from '@/application/usecases/notifications/get-notification-by-id.usecase';
import { UpdateNotificationUseCase } from '@/application/usecases/notifications/update-notification.usecase';
import { DeleteNotificationUseCase } from '@/application/usecases/notifications/delete-notification.usecase';
import { NotificationRepository } from '@/infrastructure/persistence/typeorm/repositories/notification.repository';

const TEST_SECRET = 'test-secret';

const mockNotificationDomain = {
  id: 'notif-1',
  title: 'Alert',
  message: 'Hello',
};
const mockNotificationModel = {
  ...mockNotificationDomain,
  toDomain: jest.fn().mockReturnValue(mockNotificationDomain),
};

describe('Notifications (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  const mockNotificationRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: TEST_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [NotificationController],
      providers: [
        CreateNotificationUseCase,
        GetNotificationByIdUseCase,
        UpdateNotificationUseCase,
        DeleteNotificationUseCase,
        { provide: NotificationRepository, useValue: mockNotificationRepo },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const jwtService = module.get(JwtService);
    authToken = await jwtService.signAsync({
      sub: 'user-1',
      email: 'test@test.com',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /notifications/:id', () => {
    it('returns 200 and the notification when found', async () => {
      mockNotificationRepo.findById.mockResolvedValue(mockNotificationModel);

      const response = await request(app.getHttpServer())
        .get('/notifications/notif-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        notification: { id: 'notif-1', title: 'Alert' },
      });
    });

    it('returns 200 with null notification when not found', async () => {
      mockNotificationRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/notifications/missing')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ notification: null });
    });

    it('returns 401 without a token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/notifications/notif-1',
      );
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /notifications', () => {
    it('returns 201 and creates the notification', async () => {
      mockNotificationRepo.create.mockResolvedValue(mockNotificationModel);

      const response = await request(app.getHttpServer())
        .post('/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Alert', message: 'Hello' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        notification: { title: 'Alert', message: 'Hello' },
      });
    });

    it('returns 401 without a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/notifications')
        .send({ title: 'Alert', message: 'Hello' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /notifications/:id', () => {
    it('returns 200 and the updated notification', async () => {
      const updated = {
        ...mockNotificationModel,
        title: 'Updated',
        toDomain: jest
          .fn()
          .mockReturnValue({ ...mockNotificationDomain, title: 'Updated' }),
      };
      mockNotificationRepo.findById.mockResolvedValue(updated);
      mockNotificationRepo.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch('/notifications/notif-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        notification: { title: 'Updated' },
      });
    });

    it('returns 404 when notification not found', async () => {
      mockNotificationRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch('/notifications/missing')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'X' });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('returns 204 when notification is deleted', async () => {
      mockNotificationRepo.findById.mockResolvedValue(mockNotificationModel);
      mockNotificationRepo.delete.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .delete('/notifications/notif-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('returns 404 when notification not found', async () => {
      mockNotificationRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete('/notifications/missing')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
