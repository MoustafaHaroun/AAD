import { UnauthorizedException } from '@nestjs/common';
import { CreateListingUseCase } from './create-listing.usecase';
import { ListingCategory } from '@/domain/enums/listing-category.enum';
import { ListingType } from '@/domain/enums/listing-type.enum';

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
  description: 'Desc',
  category: ListingCategory.CARPENTRY,
  type: ListingType.OFFER,
  attachments: [],
  user: { id: 'user-1' },
};

describe('CreateListingUseCase', () => {
  let useCase: CreateListingUseCase;
  const mockListingRepo = { create: jest.fn() };
  const mockUserRepo = { findById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateListingUseCase(
      mockListingRepo as any,
      mockUserRepo as any,
    );
  });

  it('creates and returns a listing for a valid user', async () => {
    mockUserRepo.findById.mockResolvedValue(mockUserModel);
    mockListingRepo.create.mockResolvedValue({
      toDomain: () => mockListingDomain,
    });

    const result = await useCase.execute({
      title: 'Test Listing',
      description: 'Desc',
      category: ListingCategory.CARPENTRY,
      type: ListingType.OFFER,
      userId: 'user-1',
    });

    expect(result).toEqual({ listing: mockListingDomain });
    expect(mockListingRepo.create).toHaveBeenCalled();
  });

  it('throws UnauthorizedException when user is not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        title: 'Test',
        description: 'description',
        category: ListingCategory.CARPENTRY,
        type: ListingType.OFFER,
        userId: 'missing',
      }),
    ).rejects.toThrow(UnauthorizedException);
    expect(mockListingRepo.create).not.toHaveBeenCalled();
  });
});
