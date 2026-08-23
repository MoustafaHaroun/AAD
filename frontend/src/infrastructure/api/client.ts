import { router } from "expo-router";
import { tokenStore } from "@/infrastructure/api/token-store";
import { queryClient } from "@/infrastructure/api/query-client";
import { extractErrorMessage } from "@/infrastructure/api/extract-error-message.util";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

/**
 * Send an authenticated request to the API and decode its JSON response.
 * @param path - The request path, appended to the API base URL.
 * @param init - The fetch options.
 * @returns The decoded response body.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = tokenStore.get();

    const headers: Record<string, string> = {
        ...init.body != null && !(init.body instanceof FormData)
            ? { "Content-Type": "application/json" } // eslint-disable-line typescript/naming-convention
            : {},
        ...token == null ? {} : { Authorization: `Bearer ${token}` }, // eslint-disable-line typescript/naming-convention
        ...init.headers as Record<string, string>,
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

        throw new Error(extractErrorMessage(text) ?? `API ${response.status}: ${text}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const apiClient = {
    /**
     * Send a GET request.
     * @param path - The request path, appended to the API base URL.
     * @returns The decoded response body.
     */
    get: async <T>(path: string): Promise<T> => request<T>(path, { method: "GET" }),

    /**
     * Send a POST request with a JSON body.
     * @param path - The request path, appended to the API base URL.
     * @param body - The value to send as the JSON body.
     * @returns The decoded response body.
     */
    post: async <T>(path: string, body?: unknown): Promise<T> => request<T>(path, {
        method: "POST",
        body: body == null ? undefined : JSON.stringify(body),
    }),

    /**
     * Send a PATCH request with a JSON body.
     * @param path - The request path, appended to the API base URL.
     * @param body - The value to send as the JSON body.
     * @returns The decoded response body.
     */
    patch: async <T>(path: string, body?: unknown): Promise<T> => request<T>(path, {
        method: "PATCH",
        body: body == null ? undefined : JSON.stringify(body),
    }),

    /**
     * Send a DELETE request.
     * @param path - The request path, appended to the API base URL.
     * @returns Undefined, once the request completes.
     */
    delete: async (path: string): Promise<undefined> => request<undefined>(path, { method: "DELETE" }),

    /**
     * Send a POST request with a multipart form-data body.
     * @param path - The request path, appended to the API base URL.
     * @param formData - The form data to send.
     * @returns The decoded response body.
     */
    postFormData: async <T>(path: string, formData: FormData): Promise<T> => request<T>(path, { method: "POST", body: formData }),
};
