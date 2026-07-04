import { di, UseCaseBase } from "@/infrastructure/di";
import { AUTH_REPOSITORY_TOKEN, type IAuthRepository } from "@/domain/repositories";
import type { AuthToken } from "@/domain/entities";

export type SignInParams = { email: string; password: string };

export class SignIn extends UseCaseBase<AuthToken, SignInParams> {
    private readonly authRepository;

    constructor() {
        super();
        this.authRepository = di.inject<IAuthRepository>(AUTH_REPOSITORY_TOKEN);
    }

    async execute({ email, password }: SignInParams): Promise<AuthToken> {
        return this.authRepository.signIn(email, password);
    }
}
