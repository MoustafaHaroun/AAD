import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { UserController } from '@/presentation/controllers/user.controller';
import { CreateUserUseCase } from '@/application/usecases/users/create-user.usecase';
import { GetUserByIdUseCase } from '@/application/usecases/users/get-user-by-id.usecase';
import { UpdateUserUseCase } from '@/application/usecases/users/update-user.usecase';
import { DeleteUserUseCase } from '@/application/usecases/users/delete-user.usecase';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';

const mockUserDomain = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

const mockUserModel = {
  ...mockUserDomain,
  password: 'pass',
  toDomain: jest.fn().mockReturnValue(mockUserDomain),
};

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  const mockUserRepo = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UserController],
      providers: [
        CreateUserUseCase,
        GetUserByIdUseCase,
        UpdateUserUseCase,
        DeleteUserUseCase,
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('returns 201 and creates the user', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUserModel);

      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'test@test.com',
        password: 'pass',
        firstname: 'John',
        surname: 'Doe',
      });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        user: { email: 'test@test.com', firstname: 'John' },
      });
    });

    it('returns 409 when email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUserModel);

      const response = await request(app.getHttpServer()).post('/users').send({
        email: 'test@test.com',
        password: 'pass',
        firstname: 'John',
        surname: 'Doe',
      });

      expect(response.status).toBe(HttpStatus.CONFLICT);
    });
  });

  describe('GET /users/:id', () => {
    it('returns 200 and the user when found', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUserModel);

      const response = await request(app.getHttpServer()).get('/users/user-1');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ user: { id: 'user-1' } });
    });

    it('returns 200 with null when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).get('/users/missing');

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ user: null });
    });
  });

  describe('PATCH /users/:id', () => {
    it('returns 200 and the updated user', async () => {
      const updatedModel = {
        ...mockUserModel,
        firstname: 'Jane',
        toDomain: jest
          .fn()
          .mockReturnValue({ ...mockUserDomain, firstname: 'Jane' }),
      };
      mockUserRepo.findById.mockResolvedValue(updatedModel);
      mockUserRepo.update.mockResolvedValue(updatedModel);

      const response = await request(app.getHttpServer())
        .patch('/users/user-1')
        .send({ firstname: 'Jane' });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('returns 404 when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch('/users/missing')
        .send({ firstname: 'Jane' });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /users/:id', () => {
    it('returns 204 when user is deleted', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUserModel);
      mockUserRepo.delete.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer()).delete(
        '/users/user-1',
      );

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('returns 404 when user not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer()).delete(
        '/users/missing',
      );

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
