import { di, UseCaseBase } from "@/infrastructure/di";
import { AUTH_REPOSITORY_TOKEN, type IAuthRepository } from "@/domain/repositories";
import type { AuthToken } from "@/domain/entities";

export interface SignInParams { email: string, password: string }

/**
 * Authenticate a user and issue an auth token.
 */
export class SignIn extends UseCaseBase<AuthToken, SignInParams> {
    private readonly authRepository;

    constructor() {
        super();
        this.authRepository = di.inject<IAuthRepository>(AUTH_REPOSITORY_TOKEN);
    }

    /**
     * Sign the user in.
     * @param params - The use case parameters.
     * @param params.email - The user's email.
     * @param params.password - The user's password.
     * @returns The auth token.
     */
    public async execute({ email, password }: SignInParams): Promise<AuthToken> {
        return this.authRepository.signIn(email, password);
    }
}
