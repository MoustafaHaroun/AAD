import { tokenStore } from "@/infrastructure/api/token-store";
import type { JwtPayload } from "@/domain/entities";

/**
 * Return the decoded JWT payload for the signed-in user.
 * @returns The current user's JWT payload, or null if signed out.
 */
export function useCurrentUser(): JwtPayload | null {
    return tokenStore.getPayload();
}

/**
 * Return the signed-in user's id.
 * @returns The current user's id, or null if signed out.
 */
export function useCurrentUserId(): string | null {
    return tokenStore.getUserId();
}
