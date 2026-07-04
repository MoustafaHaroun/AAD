import { apiClient } from "@/infrastructure/api";
import type { IUserRepository } from "@/domain/repositories";
import type { User, CreateUserBody, UpdateUserBody } from "@/domain/entities";

export class UserHttpRepository implements IUserRepository {
    async getAllUsers(): Promise<User[]> {
        return apiClient.get<User[]>("/users");
    }

    async getUser(id: string): Promise<User> {
        return apiClient.get<User>(`/users/${id}`);
    }

    async createUser(body: CreateUserBody): Promise<User> {
        return apiClient.post<User>("/users", body);
    }

    async updateUser(id: string, body: UpdateUserBody): Promise<User> {
        return apiClient.patch<User>(`/users/${id}`, body);
    }

    async deleteUser(id: string): Promise<void> {
        return apiClient.delete(`/users/${id}`);
    }
}
