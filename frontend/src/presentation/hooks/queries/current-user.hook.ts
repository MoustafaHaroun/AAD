import { tokenStore } from "@/infrastructure/api/token-store";
import type { JwtPayload } from "@/domain/entities";

export function useCurrentUser(): JwtPayload | null {
    return tokenStore.getPayload();
}

export function useCurrentUserId(): string | null {
    return tokenStore.getUserId();
}
