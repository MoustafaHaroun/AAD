import { NotFoundException } from '@nestjs/common';
import { Role } from '@/domain/enums/role.enum';
import { GetListingByIdUseCase } from './get-listing-by-id.usecase';

const mockListingDomain = {
  id: 'listing-1',
  title: 'Test Listing',
  description: null,
  attachments: [],
  user: {
    id: 'user-1',
    email: 'user1@test.com',
    firstname: 'Jane',
    surname: 'Doe',
    role: Role.USER,
    location: 'Enschede',
  },
};

describe('GetListingByIdUseCase', () => {
  let useCase: GetListingByIdUseCase;
  const mockListingRepo = { findById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetListingByIdUseCase(mockListingRepo as any);
  });

  it('returns the listing with the user trimmed to id/firstname/surname/role', async () => {
    mockListingRepo.findById.mockResolvedValue({
      toDomain: () => mockListingDomain,
    });

    const result = await useCase.execute({ id: 'listing-1' });

    expect(result).toEqual({
      listing: {
        id: 'listing-1',
        title: 'Test Listing',
        description: null,
        attachments: [],
        user: {
          id: 'user-1',
          firstname: 'Jane',
          surname: 'Doe',
          role: Role.USER,
        },
      },
    });
  });

  it('throws NotFoundException when listing does not exist', async () => {
    mockListingRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
