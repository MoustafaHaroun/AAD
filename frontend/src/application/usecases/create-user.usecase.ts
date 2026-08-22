import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, CreateUserBody } from "@/domain/entities";

/**
 * Register a new user.
 */
export class CreateUser extends UseCaseBase<User, CreateUserBody> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Create the user.
     * @param body - The user data to create.
     * @returns The created user.
     */
    public async execute(body: CreateUserBody): Promise<User> {
        return this.userRepository.createUser(body);
    }
}
