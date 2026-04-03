import { GetUserByIdUseCase } from './get-user-by-id.usecase';

const mockUserDomain = {
  id: 'user-1',
  email: 'test@test.com',
  firstname: 'John',
  surname: 'Doe',
  listings: [],
  notifications: [],
};

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  const mockUserRepo = { findById: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserByIdUseCase(mockUserRepo as any);
  });

  it('returns the user when found', async () => {
    mockUserRepo.findById.mockResolvedValue({ toDomain: () => mockUserDomain });

    const result = await useCase.execute({ id: 'user-1' });

    expect(result).toEqual({ user: mockUserDomain });
  });

  it('returns null when user does not exist', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await useCase.execute({ id: 'missing' });

    expect(result).toEqual({ user: null });
  });
});
