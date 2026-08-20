import { Role } from '@/domain/enums/role.enum';
import { GetRandomListingsUseCase } from './get-random-listings.usecase';

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

describe('GetRandomListingsUseCase', () => {
  let useCase: GetRandomListingsUseCase;
  const mockListingRepo = { findRandom: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetRandomListingsUseCase(mockListingRepo as any);
  });

  it('returns random listings with the user trimmed to id/firstname/surname/role', async () => {
    mockListingRepo.findRandom.mockResolvedValue([
      { toDomain: () => mockListingDomain },
    ]);

    const result = await useCase.execute({ limit: 10 });

    expect(mockListingRepo.findRandom).toHaveBeenCalledWith(10);
    expect(result).toEqual({
      listings: [
        {
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
      ],
    });
  });

  it('returns an empty array when there are no listings', async () => {
    mockListingRepo.findRandom.mockResolvedValue([]);

    const result = await useCase.execute({ limit: 10 });

    expect(result).toEqual({ listings: [] });
  });
});
