import { GetListingsByUserUseCase } from './get-listings-by-user.usecase';

const mockListingDomain = {
  id: 'listing-1',
  title: 'Test Listing',
  description: null,
  attachments: [],
  user: { id: 'user-1' },
};

describe('GetListingsByUserUseCase', () => {
  let useCase: GetListingsByUserUseCase;
  const mockListingRepo = { findAllByUserId: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetListingsByUserUseCase(mockListingRepo as any);
  });

  it('returns mapped listings for a user', async () => {
    mockListingRepo.findAllByUserId.mockResolvedValue([
      { toDomain: () => mockListingDomain },
    ]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual({ listings: [mockListingDomain] });
    expect(mockListingRepo.findAllByUserId).toHaveBeenCalledWith('user-1');
  });

  it('returns empty array when user has no listings', async () => {
    mockListingRepo.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute({ userId: 'user-1' });

    expect(result).toEqual({ listings: [] });
  });
});
