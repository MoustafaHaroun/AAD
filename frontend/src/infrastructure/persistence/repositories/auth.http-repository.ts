import { apiClient, tokenStore } from "@/infrastructure/api";
import type { IAuthRepository } from "@/domain/repositories";
import type { AuthToken } from "@/domain/entities";

export class AuthHttpRepository implements IAuthRepository {
    async signIn(email: string, password: string): Promise<AuthToken> {
        const token = await apiClient.post<AuthToken>("/auth", { email, password });
        tokenStore.set(token.token);
        return token;
    }
}
