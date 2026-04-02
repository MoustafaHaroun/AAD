import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { SignInUseCase } from '@/application/usecases/sign-in.usecase';

describe('AuthController', () => {
  let controller: AuthController;
  const mockSignInUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: SignInUseCase, useValue: mockSignInUseCase }],
    }).compile();

    controller = module.get(AuthController);
  });

  it('calls SignInUseCase and returns the token', async () => {
    mockSignInUseCase.execute.mockResolvedValue({ token: 'jwt-token' });

    const result = await controller.signIn({
      email: 'user@test.com',
      password: 'pass',
    });

    expect(result).toEqual({ token: 'jwt-token' });
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith({
      email: 'user@test.com',
      password: 'pass',
    });
  });
});
