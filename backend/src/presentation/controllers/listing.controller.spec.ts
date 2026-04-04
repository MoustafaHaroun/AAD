import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@/presentation/guards/auth.guard';
import { ListingController } from './listing.controller';
import { CreateListingUseCase } from '@/application/usecases/listings/create-listing.usecase';
import { GetListingByIdUseCase } from '@/application/usecases/listings/get-listing-by-id.usecase';
import { GetListingsByUserIdUseCase } from '@/application/usecases/listings/get-listings-by-user-id.usecase';
import { RemoveAttachmentFromListingUseCase } from '@/application/usecases/listings/remove-attachment-from-listing.usecase';
import { UpdateListingUseCase } from '@/application/usecases/listings/update-listing.usecase';
import { DeleteListingUseCase } from '@/application/usecases/listings/delete-listing.usecase';
import { AddAttachmentToListingUseCase } from '@/application/usecases/listings/add-attachment-to-listing.usecase';
import { AuthenticatedRequest } from '@/presentation/guards/auth.guard';

const mockListing = {
  id: 'listing-1',
  title: 'Test',
  description: null,
  attachments: [],
  user: { id: 'user-1' },
};

const mockAuthReq = {
  user: { sub: 'user-1', email: 'test@test.com' },
} as AuthenticatedRequest;

describe('ListingController', () => {
  let controller: ListingController;
  const mockCreateUseCase = { execute: jest.fn() };
  const mockAddAttachmentUseCase = { execute: jest.fn() };
  const mockGetByUserUseCase = { execute: jest.fn() };
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
        { provide: GetListingsByUserIdUseCase, useValue: mockGetByUserUseCase },
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

  it('getListings passes userId from JWT to GetListingsByUserUseCase', async () => {
    mockGetByUserUseCase.execute.mockResolvedValue({ listings: [mockListing] });

    const result = await controller.getListings(mockAuthReq);

    expect(result).toEqual({ listings: [mockListing] });
    expect(mockGetByUserUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-1',
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

  it('updateListing delegates to UpdateListingUseCase with merged id', async () => {
    mockUpdateUseCase.execute.mockResolvedValue({ listing: mockListing });

    const result = await controller.updateListing('listing-1', {
      title: 'Updated',
    });

    expect(result).toEqual({ listing: mockListing });
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id: 'listing-1',
      title: 'Updated',
    });
  });

  it('deleteListing delegates to DeleteListingUseCase', async () => {
    mockDeleteUseCase.execute.mockResolvedValue(undefined);

    await controller.deleteListing('listing-1');

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id: 'listing-1' });
  });
});
