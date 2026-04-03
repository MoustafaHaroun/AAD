import { NotFoundException } from '@nestjs/common';
import { UpdateListingUseCase } from './update-listing.usecase';

const mockListingDomain = {
  id: 'listing-1',
  title: 'Updated Title',
  description: 'Updated',
  attachments: [],
  user: { id: 'user-1' },
};

describe('UpdateListingUseCase', () => {
  let useCase: UpdateListingUseCase;
  const mockListingRepo = { findById: jest.fn(), update: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateListingUseCase(mockListingRepo as any);
  });

  it('updates and returns the listing', async () => {
    const model = {
      id: 'listing-1',
      title: 'Old Title',
      description: null,
      toDomain: jest.fn().mockReturnValue(mockListingDomain),
    };
    mockListingRepo.findById.mockResolvedValue(model);
    mockListingRepo.update.mockResolvedValue(model);

    const result = await useCase.execute({
      id: 'listing-1',
      title: 'Updated Title',
      description: 'Updated',
    });

    expect(model.title).toBe('Updated Title');
    expect(model.description).toBe('Updated');
    expect(result).toEqual({ listing: mockListingDomain });
  });

  it('throws NotFoundException when listing does not exist', async () => {
    mockListingRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'missing', title: 'X' }),
    ).rejects.toThrow(NotFoundException);
    expect(mockListingRepo.update).not.toHaveBeenCalled();
  });
});
