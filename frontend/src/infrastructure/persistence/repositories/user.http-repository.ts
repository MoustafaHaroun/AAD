import { apiClient } from "@/infrastructure/api";
import type { IUserRepository } from "@/domain/repositories";
import type { User, CreateUserBody, UpdateUserBody, RNFile } from "@/domain/entities";

export class UserHttpRepository implements IUserRepository {
    async getAllUsers(): Promise<User[]> {
        const { users } = await apiClient.get<{ users: User[] }>("/users");

        return users;
    }

    async getUser(id: string): Promise<User> {
        const { user } = await apiClient.get<{ user: User }>(`/users/${id}`);

        return user;
    }

    async createUser(body: CreateUserBody): Promise<User> {
        const { user } = await apiClient.post<{ user: User }>("/users", body);

        return user;
    }

    async updateUser(id: string, body: UpdateUserBody): Promise<User> {
        const { user } = await apiClient.patch<{ user: User }>(`/users/${id}`, body);

        return user;
    }

    async deleteUser(id: string): Promise<void> {
        return apiClient.delete(`/users/${id}`);
    }

    async uploadAvatar(id: string, file: RNFile): Promise<User> {
        const formData = new FormData();

        formData.append("binary", file as unknown as Blob);

        const { user } = await apiClient.postFormData<{ user: User }>(`/users/${id}/avatar`, formData);

        return user;
    }
}
