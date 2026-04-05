import { UnauthorizedException } from '@nestjs/common';
import { SignInUseCase } from './sign-in.usecase';

describe('SignInUseCase', () => {
  let useCase: SignInUseCase;
  const mockAuthService = { signIn: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new SignInUseCase(mockAuthService as any);
  });

  it('returns a token for valid credentials', async () => {
    mockAuthService.signIn.mockResolvedValue('jwt-token');

    const result = await useCase.execute({
      email: 'user@test.com',
      password: 'pass',
    });

    expect(result).toEqual({ token: 'jwt-token' });
    expect(mockAuthService.signIn).toHaveBeenCalledWith(
      'user@test.com',
      'pass',
    );
  });

  it('propagates UnauthorizedException from AuthService', async () => {
    mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

    await expect(
      useCase.execute({ email: 'x', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
