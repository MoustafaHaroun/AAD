import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, UpdateUserBody } from "@/domain/entities";

export type UpdateUserParams = { id: string; body: UpdateUserBody };

export class UpdateUser extends UseCaseBase<User, UpdateUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute({ id, body }: UpdateUserParams): Promise<User> {
        return this.userRepository.updateUser(id, body);
    }
}
