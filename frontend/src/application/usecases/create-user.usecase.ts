import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, CreateUserBody } from "@/domain/entities";

export class CreateUser extends UseCaseBase<User, CreateUserBody> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute(body: CreateUserBody): Promise<User> {
        return this.userRepository.createUser(body);
    }
}
