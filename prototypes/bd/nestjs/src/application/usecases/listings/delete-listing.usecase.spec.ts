import { NotFoundException } from '@nestjs/common';
import { DeleteListingUseCase } from './delete-listing.usecase';

describe('DeleteListingUseCase', () => {
  let useCase: DeleteListingUseCase;
  const mockListingRepo = { findById: jest.fn(), delete: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteListingUseCase(mockListingRepo as any);
  });

  it('deletes the listing when found', async () => {
    mockListingRepo.findById.mockResolvedValue({ id: 'listing-1' });
    mockListingRepo.delete.mockResolvedValue(undefined);

    await expect(useCase.execute({ id: 'listing-1' })).resolves.toBeUndefined();
    expect(mockListingRepo.delete).toHaveBeenCalledWith('listing-1');
  });

  it('throws NotFoundException when listing does not exist', async () => {
    mockListingRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'missing' })).rejects.toThrow(
      NotFoundException,
    );
    expect(mockListingRepo.delete).not.toHaveBeenCalled();
  });
});
