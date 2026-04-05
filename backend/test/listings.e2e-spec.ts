import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { ListingController } from '@/presentation/controllers/listing.controller';
import { CreateListingUseCase } from '@/application/usecases/listings/create-listing.usecase';
import { GetListingByIdUseCase } from '@/application/usecases/listings/get-listing-by-id.usecase';
import { GetListingsByUserIdUseCase } from '@/application/usecases/listings/get-listings-by-user-id.usecase';
import { UpdateListingUseCase } from '@/application/usecases/listings/update-listing.usecase';
import { DeleteListingUseCase } from '@/application/usecases/listings/delete-listing.usecase';
import { AddAttachmentToListingUseCase } from '@/application/usecases/listings/add-attachment-to-listing.usecase';
import { RemoveAttachmentFromListingUseCase } from '@/application/usecases/listings/remove-attachment-from-listing.usecase';
import { ListingRepository } from '@/infrastructure/persistence/typeorm/repositories/listing.repository';
import { UserRepository } from '@/infrastructure/persistence/typeorm/repositories/user.repository';
import { AttachmentRepository } from '@/infrastructure/persistence/typeorm/repositories/attachment.repository';
import { MinioClient } from '@/infrastructure/persistence/minio';
import { DataSource } from 'typeorm';

const TEST_SECRET = 'test-secret';

const mockUserModel = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
  toDomain: jest.fn(),
};

const mockListingDomain = {
  id: 'listing-1',
  title: 'Test Listing',
  description: null,
  attachments: [],
  user: { id: 'user-1' } as unknown as import('@/domain/entities').User,
};

const mockListingModel = {
  ...mockListingDomain,
  user: mockUserModel,
  toDomain: jest.fn().mockReturnValue(mockListingDomain),
};

describe('Listings (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  const mockListingRepo = {
    create: jest.fn(),
    findById: jest.fn(),
    findAllByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockUserRepo = { findById: jest.fn() };
  const mockAttachmentRepo = { create: jest.fn(), findById: jest.fn(), delete: jest.fn() };
  const mockMinioClient = { upload: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: TEST_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [ListingController],
      providers: [
        CreateListingUseCase,
        AddAttachmentToListingUseCase,
        RemoveAttachmentFromListingUseCase,
        GetListingsByUserIdUseCase,
        GetListingByIdUseCase,
        UpdateListingUseCase,
        DeleteListingUseCase,
        { provide: ListingRepository, useValue: mockListingRepo },
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: AttachmentRepository, useValue: mockAttachmentRepo },
        { provide: MinioClient, useValue: mockMinioClient },
        { provide: DataSource, useValue: { transaction: jest.fn() } },
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

  describe('GET /listings', () => {
    it('returns 200 and listings for the authenticated user', async () => {
      mockListingRepo.findAllByUserId.mockResolvedValue([mockListingModel]);

      const response = await request(app.getHttpServer())
        .get('/listings')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        listings: [{ id: 'listing-1' }],
      });
    });

    it('returns 401 without a token', async () => {
      const response = await request(app.getHttpServer()).get('/listings');
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET /listings/:id', () => {
    it('returns 200 and the listing when found', async () => {
      mockListingRepo.findById.mockResolvedValue(mockListingModel);

      const response = await request(app.getHttpServer())
        .get('/listings/listing-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({ listing: { id: 'listing-1' } });
    });

    it('returns 404 when listing not found', async () => {
      mockListingRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/listings/missing')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /listings', () => {
    it('returns 201 and creates the listing', async () => {
      mockUserRepo.findById.mockResolvedValue(mockUserModel);
      mockListingRepo.create.mockResolvedValue(mockListingModel);

      const response = await request(app.getHttpServer())
        .post('/listings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Listing', description: 'A test listing' });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        listing: { title: 'Test Listing' },
      });
    });

    it('returns 401 without a token', async () => {
      const response = await request(app.getHttpServer())
        .post('/listings')
        .send({ title: 'X' });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /listings/:id', () => {
    it('returns 200 and the updated listing', async () => {
      const updated = {
        ...mockListingModel,
        title: 'Updated',
        toDomain: jest
          .fn()
          .mockReturnValue({ ...mockListingDomain, title: 'Updated' }),
      };
      mockListingRepo.findById.mockResolvedValue(updated);
      mockListingRepo.update.mockResolvedValue(updated);

      const response = await request(app.getHttpServer())
        .patch('/listings/listing-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('returns 404 when listing not found', async () => {
      mockListingRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .patch('/listings/missing')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'X' });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /listings/:id', () => {
    it('returns 204 when listing is deleted', async () => {
      mockListingRepo.findById.mockResolvedValue(mockListingModel);
      mockListingRepo.delete.mockResolvedValue(undefined);

      const response = await request(app.getHttpServer())
        .delete('/listings/listing-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    });

    it('returns 404 when listing not found', async () => {
      mockListingRepo.findById.mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .delete('/listings/missing')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
