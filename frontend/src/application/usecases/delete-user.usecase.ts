import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";

export interface DeleteUserParams { id: string }

/**
 * Delete a user account.
 */
export class DeleteUser extends UseCaseBase<void, DeleteUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Delete the user.
     * @param params - The use case parameters.
     * @param params.id - The id of the user to delete.
     */
    public async execute({ id }: DeleteUserParams): Promise<void> {
        await this.userRepository.deleteUser(id);
    }
}
