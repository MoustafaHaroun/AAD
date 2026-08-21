import type { User, CreateUserBody, UpdateUserBody, RNFile } from "@/domain/entities";

export const USER_REPOSITORY_TOKEN = Symbol("IUserRepository");

export interface IUserRepository {
    getAllUsers: () => Promise<User[]>,
    getUser: (id: string) => Promise<User>,
    createUser: (body: CreateUserBody) => Promise<User>,
    updateUser: (id: string, body: UpdateUserBody) => Promise<User>,
    deleteUser: (id: string) => Promise<void>,
    uploadAvatar: (id: string, file: RNFile) => Promise<User>,
}
