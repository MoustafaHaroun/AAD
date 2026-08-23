import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User } from "@/domain/entities";

/**
 * Fetch all users.
 */
export class GetAllUsers extends UseCaseBase<User[]> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the users.
     * @returns All users.
     */
    public async execute(): Promise<User[]> {
        return this.userRepository.getAllUsers();
    }
}
