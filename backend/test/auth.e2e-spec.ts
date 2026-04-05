import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthController } from '@/presentation/controllers/auth.controller';
import { SignInUseCase } from '@/application/usecases/sign-in.usecase';
import { AuthService } from '@/infrastructure/services/auth.service';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';

const TEST_JWT_SECRET = 'test-secret';

const VALID_PASSWORD = 'Password123!';
const VALID_PASSWORD_HASH =
  '$2b$10$IXtZ1TWBMd0zK34STBK0p.GbYMXe1GZNx6FWNvng8kTbyyN2hW3dG';

const mockUserModel = {
  id: 'user-1',
  email: 'user@test.com',
  password: VALID_PASSWORD_HASH,
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
  toDomain: jest.fn(),
};

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  const mockUserRepo = { findByEmail: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: TEST_JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        SignInUseCase,
        AuthService,
        { provide: UserRepository, useValue: mockUserRepo },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth', () => {
    it('returns 200 and a JWT token for valid credentials', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUserModel);

      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({ email: 'user@test.com', password: VALID_PASSWORD });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toMatchObject({ token: expect.any(String) });
    });

    it('returns 401 for wrong password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUserModel);

      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({ email: 'user@test.com', password: 'Wr0ng!Wrong1' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('returns 401 when user does not exist', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .post('/auth')
        .send({ email: 'nobody@test.com', password: 'Password123!' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
