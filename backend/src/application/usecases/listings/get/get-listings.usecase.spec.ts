import { GetListingsUseCase } from './get-listings.usecase';

const mockListingDomain = {
  id: 'listing-1',
  title: 'Test Listing',
  description: null,
  attachments: [],
  user: { id: 'user-1' },
};

describe('GetListingsUseCase', () => {
  let useCase: GetListingsUseCase;
  const mockListingRepo = { findAll: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetListingsUseCase(mockListingRepo as any);
  });

  it('returns all listings mapped to domain when no query is given', async () => {
    mockListingRepo.findAll.mockResolvedValue([
      { toDomain: () => mockListingDomain },
    ]);

    const result = await useCase.execute({});

    expect(mockListingRepo.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({ listings: [mockListingDomain] });
  });

  it('passes the search query through to the repository', async () => {
    mockListingRepo.findAll.mockResolvedValue([
      { toDomain: () => mockListingDomain },
    ]);

    await useCase.execute({ q: 'carpentry' });

    expect(mockListingRepo.findAll).toHaveBeenCalledWith('carpentry');
  });
});
