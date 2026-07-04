import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";

export type DeleteUserParams = { id: string };

export class DeleteUser extends UseCaseBase<void, DeleteUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute({ id }: DeleteUserParams): Promise<void> {
        return this.userRepository.deleteUser(id);
    }
}
