import { router } from "expo-router";
import { tokenStore } from "@/infrastructure/api/token-store";
import { queryClient } from "@/infrastructure/api/query-client";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

/**
 *
 * @param path
 * @param init
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = tokenStore.get();

    const headers: Record<string, string> = {
        ...init.body != null && !(init.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {},
        ...token ? { Authorization: `Bearer ${token}` } : {},
        ...init.headers as Record<string, string> ?? {},
    };

    const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

    if (!response.ok) {
        // A 401 on a request that carried a token means the session itself was
        // Rejected (expired/invalidated), not a login attempt with bad
        // Credentials (those requests never carry a token) — sign the user out.
        if (response.status === 401 && token != null) {
            tokenStore.clear();
            queryClient.clear();
            router.replace("/");
        }

        const text = await response.text();

        throw new Error(`API ${response.status}: ${text}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get: async <T>(path: string) => request<T>(path, { method: "GET" }),

    post: async <T>(path: string, body?: unknown) => request<T>(path, {
        method: "POST",
        body: body != null ? JSON.stringify(body) : undefined,
    }),

    patch: async <T>(path: string, body?: unknown) => request<T>(path, {
        method: "PATCH",
        body: body != null ? JSON.stringify(body) : undefined,
    }),

    delete: async (path: string) => request<void>(path, { method: "DELETE" }),

    postFormData: async <T>(path: string, formData: FormData) => request<T>(path, { method: "POST", body: formData }),
};
