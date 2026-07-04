import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User } from "@/domain/entities";

export class GetAllUsers extends UseCaseBase<User[]> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}
