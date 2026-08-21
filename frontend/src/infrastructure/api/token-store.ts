import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import type { JwtPayload } from "@/domain/entities";

const SECURE_STORE_KEY = "trade2.auth-token";

class TokenStore {
    private token: string | null = null;

    /**
     * Restores the token from SecureStore into the in-memory mirror. Must be
     * awaited once at app boot, before any route guard reads `get()`.
     */
    async hydrate(): Promise<void> {
        this.token = await SecureStore.getItemAsync(SECURE_STORE_KEY);
    }

    set(token: string | null): void {
        this.token = token;

        if (token == null) {
            void SecureStore.deleteItemAsync(SECURE_STORE_KEY);
        } else {
            void SecureStore.setItemAsync(SECURE_STORE_KEY, token);
        }
    }

    get(): string | null {
        return this.token;
    }

    getPayload(): JwtPayload | null {
        if (this.token == null) {
            return null;
        }

        try {
            return jwtDecode<JwtPayload>(this.token);
        } catch {
            return null;
        }
    }

    getUserId(): string | null {
        return this.getPayload()?.sub ?? null;
    }

    clear(): void {
        this.token = null;
        void SecureStore.deleteItemAsync(SECURE_STORE_KEY);
    }
}

export const tokenStore = new TokenStore();
