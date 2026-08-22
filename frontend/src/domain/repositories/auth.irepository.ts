import type { AuthToken } from "@/domain/entities";

export const AUTH_REPOSITORY_TOKEN = Symbol("IAuthRepository");

export interface IAuthRepository {
    signIn: (email: string, password: string) => Promise<AuthToken>,
}
