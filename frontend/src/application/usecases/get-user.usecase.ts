import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User } from "@/domain/entities";

export type GetUserParams = { id: string };

export class GetUser extends UseCaseBase<User, GetUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute({ id }: GetUserParams): Promise<User> {
        return this.userRepository.getUser(id);
    }
}
