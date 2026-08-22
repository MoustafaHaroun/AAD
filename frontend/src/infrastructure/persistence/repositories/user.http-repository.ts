import { apiClient } from "@/infrastructure/api";
import type { IUserRepository } from "@/domain/repositories";
import type { User, CreateUserBody, UpdateUserBody, RNFile } from "@/domain/entities";

/**
 * Fetch, create, update, and delete users via the API.
 */
export class UserHttpRepository implements IUserRepository {
    /**
     * Fetch all users.
     * @returns All users.
     */
    public async getAllUsers(): Promise<User[]> {
        const { users } = await apiClient.get<{ users: User[] }>("/users");

        return users;
    }

    /**
     * Fetch a user by id.
     * @param id - The id of the user to fetch.
     * @returns The user.
     */
    public async getUser(id: string): Promise<User> {
        const { user } = await apiClient.get<{ user: User }>(`/users/${id}`);

        return user;
    }

    /**
     * Register a new user.
     * @param body - The user data to create.
     * @returns The created user.
     */
    public async createUser(body: CreateUserBody): Promise<User> {
        const { user } = await apiClient.post<{ user: User }>("/users", body);

        return user;
    }

    /**
     * Update a user's profile.
     * @param id - The id of the user to update.
     * @param body - The fields to update.
     * @returns The updated user.
     */
    public async updateUser(id: string, body: UpdateUserBody): Promise<User> {
        const { user } = await apiClient.patch<{ user: User }>(`/users/${id}`, body);

        return user;
    }

    /**
     * Delete a user account.
     * @param id - The id of the user to delete.
     */
    public async deleteUser(id: string): Promise<void> {
        await apiClient.delete(`/users/${id}`);
    }

    /**
     * Upload a user's avatar image.
     * @param id - The id of the user.
     * @param file - The avatar image file.
     * @returns The updated user.
     */
    public async uploadAvatar(id: string, file: RNFile): Promise<User> {
        const formData = new FormData();

        formData.append("binary", file as unknown as Blob);

        const { user } = await apiClient.postFormData<{ user: User }>(`/users/${id}/avatar`, formData);

        return user;
    }
}
