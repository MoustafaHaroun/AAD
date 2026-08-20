import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/domain/entities";

class TokenStore {
    private token: string | null = null;

    set(token: string | null): void {
        this.token = token;
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
    }
}

export const tokenStore = new TokenStore();
