import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

const mockJwtService = { verifyAsync: jest.fn() };

const buildContext = (authHeader?: string): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: (): Record<string, unknown> => ({
        headers: { authorization: authHeader },
        user: undefined,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();
    guard = new AuthGuard(mockJwtService as any);
  });

  it('returns true for a valid Bearer token', async () => {
    const payload = { sub: 'user-1', email: 'test@test.com' };
    mockJwtService.verifyAsync.mockResolvedValue(payload);

    const result = await guard.canActivate(buildContext('Bearer valid-token'));

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('throws UnauthorizedException when no token is provided', async () => {
    await expect(guard.canActivate(buildContext())).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws UnauthorizedException when token is not Bearer type', async () => {
    await expect(
      guard.canActivate(buildContext('Basic abc123')),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token verification fails', async () => {
    mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

    await expect(
      guard.canActivate(buildContext('Bearer bad-token')),
    ).rejects.toThrow(UnauthorizedException);
  });
});
