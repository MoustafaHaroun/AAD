import { apiClient, tokenStore } from "@/infrastructure/api";
import type { IAuthRepository } from "@/domain/repositories";
import type { AuthToken } from "@/domain/entities";

/**
 * Authenticate against the API and persist the resulting session token.
 */
export class AuthHttpRepository implements IAuthRepository {
    /**
     * Sign the user in.
     * @param email - The user's email.
     * @param password - The user's password.
     * @returns The auth token.
     */
    public async signIn(email: string, password: string): Promise<AuthToken> {
        const token = await apiClient.post<AuthToken>("/auth", { email, password });

        tokenStore.set(token.token);
        return token;
    }
}
