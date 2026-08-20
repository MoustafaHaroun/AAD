import { Test, TestingModule } from '@nestjs/testing';
import {
  AuthGuard,
  AuthenticatedRequest,
} from '@/presentation/guards/auth.guard';
import { ListingController } from './listing.controller';
import { CreateListingUseCase } from '@/application/usecases/listings/create/create-listing.usecase';
import { GetListingByIdUseCase } from '@/application/usecases/listings/get/get-listing-by-id.usecase';
import { GetListingsUseCase } from '@/application/usecases/listings/get/get-listings.usecase';
import { GetRandomListingsUseCase } from '@/application/usecases/listings/get/get-random-listings.usecase';
import { RemoveAttachmentFromListingUseCase } from '@/application/usecases/listings/attachments/remove-attachment-from-listing.usecase';
import { UpdateListingUseCase } from '@/application/usecases/listings/patch/update-listing.usecase';
import { DeleteListingUseCase } from '@/application/usecases/listings/delete/delete-listing.usecase';
import { AddAttachmentToListingUseCase } from '@/application/usecases/listings/attachments/add-attachment-to-listing.usecase';
import { Role } from '@/domain/enums/role.enum';

const mockListing = {
  id: 'listing-1',
  title: 'Test',
  description: null,
  attachments: [],
  user: { id: 'user-1' },
};

const mockAuthReq = {
  user: { sub: 'user-1', email: 'test@test.com', role: Role.USER },
} as AuthenticatedRequest;

describe('ListingController', () => {
  let controller: ListingController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockAddAttachmentUseCase = { execute: jest.fn() };
  const mockGetListingsUseCase = { execute: jest.fn() };
  const mockGetRandomUseCase = { execute: jest.fn() };
  const mockRemoveAttachmentUseCase = { execute: jest.fn() };
  const mockGetByIdUseCase = { execute: jest.fn() };
  const mockUpdateUseCase = { execute: jest.fn() };
  const mockDeleteUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListingController],
      providers: [
        { provide: CreateListingUseCase, useValue: mockCreateUseCase },
        {
          provide: AddAttachmentToListingUseCase,
          useValue: mockAddAttachmentUseCase,
        },
        { provide: GetListingsUseCase, useValue: mockGetListingsUseCase },
        { provide: GetRandomListingsUseCase, useValue: mockGetRandomUseCase },
        {
          provide: RemoveAttachmentFromListingUseCase,
          useValue: mockRemoveAttachmentUseCase,
        },
        { provide: GetListingByIdUseCase, useValue: mockGetByIdUseCase },
        { provide: UpdateListingUseCase, useValue: mockUpdateUseCase },
        { provide: DeleteListingUseCase, useValue: mockDeleteUseCase },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ListingController);
  });

  it('getListings delegates to GetListingsUseCase', async () => {
    mockGetListingsUseCase.execute.mockResolvedValue({ listings: [mockListing] });

    const result = await controller.getListings({});

    expect(result).toEqual({ listings: [mockListing] });
    expect(mockGetListingsUseCase.execute).toHaveBeenCalledWith({});
  });

  it('getListings passes the search query through to GetListingsUseCase', async () => {
    mockGetListingsUseCase.execute.mockResolvedValue({ listings: [mockListing] });

    const result = await controller.getListings({ q: 'carpentry' });

    expect(result).toEqual({ listings: [mockListing] });
    expect(mockGetListingsUseCase.execute).toHaveBeenCalledWith({
      q: 'carpentry',
    });
  });

  it('getListing delegates to GetListingByIdUseCase', async () => {
    mockGetByIdUseCase.execute.mockResolvedValue({ listing: mockListing });

    const result = await controller.getListing('listing-1');

    expect(result).toEqual({ listing: mockListing });
    expect(mockGetByIdUseCase.execute).toHaveBeenCalledWith({
      id: 'listing-1',
    });
  });

  it('getRandomListings delegates to GetRandomListingsUseCase', async () => {
    mockGetRandomUseCase.execute.mockResolvedValue({ listings: [mockListing] });

    const result = await controller.getRandomListings({ limit: 10 });

    expect(result).toEqual({ listings: [mockListing] });
    expect(mockGetRandomUseCase.execute).toHaveBeenCalledWith({ limit: 10 });
  });

  it('createListing passes userId from JWT and body to CreateListingUseCase', async () => {
    mockCreateUseCase.execute.mockResolvedValue({ listing: mockListing });

    const result = await controller.createListing(mockAuthReq, {
      title: 'Test',
      description: 'Description',
    });

    expect(result).toEqual({ listing: mockListing });
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith({
      title: 'Test',
      description: 'Description',
      userId: 'user-1',
    });
  });

  it('updateListing passes requesterId and merged id to UpdateListingUseCase', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({ listing: mockListing });

    const result = await controller.updateListing(mockAuthReq, 'listing-1', {
      title: 'Updated',
    });

    expect(result).toEqual({ listing: mockListing });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: 'listing-1',
      title: 'Updated',
      requesterId: 'user-1',
    });
  });

  it('deleteListing passes requesterId to DeleteListingUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteListing(mockAuthReq, 'listing-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({
      id: 'listing-1',
      requesterId: 'user-1',
    });
  });
});
