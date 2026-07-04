import { tokenStore } from "@/infrastructure/api/token-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = tokenStore.get();

    const headers: Record<string, string> = {
        ...(init.body != null && !(init.body instanceof FormData)
            ? { "Content-Type": "application/json" }
            : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers as Record<string, string> ?? {}),
    };

    const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`API ${response.status}: ${text}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    get: <T>(path: string) =>
        request<T>(path, { method: "GET" }),

    post: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: "POST",
            body: body != null ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, {
            method: "PATCH",
            body: body != null ? JSON.stringify(body) : undefined,
        }),

    delete: (path: string) =>
        request<void>(path, { method: "DELETE" }),

    postFormData: <T>(path: string, formData: FormData) =>
        request<T>(path, { method: "POST", body: formData }),
};
