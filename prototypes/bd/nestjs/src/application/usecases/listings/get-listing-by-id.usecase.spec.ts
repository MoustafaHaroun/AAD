import { NotFoundException } from '@nestjs/common';
import { GetListingByIdUseCase } from './get-listing-by-id.usecase';

const mockListingDomain = {
  id: 'listing-1',
  title: 'Test Listing',
  description: null,
  attachments: [],
  user: { id: 'user-1' },
};

describe('GetListingByIdUseCase', () => {
  let useCase: GetListingByIdUseCase;
  const mockListingRepo = { findById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetListingByIdUseCase(mockListingRepo as any);
  });

  it('returns the listing when found', async () => {
    mockListingRepo.findById.mockResolvedValue({
      toDomain: () => mockListingDomain,
    });

    const result = await useCase.execute({ id: 'listing-1' });

    expect(result).toEqual({ listing: mockListingDomain });
  });

  it('throws NotFoundException when listing does not exist', async () => {
    mockListingRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
  });
});
