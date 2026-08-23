import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, UpdateUserBody } from "@/domain/entities";

export interface UpdateUserParams { id: string, body: UpdateUserBody }

/**
 * Update a user's profile.
 */
export class UpdateUser extends UseCaseBase<User, UpdateUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Update the user.
     * @param params - The use case parameters.
     * @param params.id - The id of the user to update.
     * @param params.body - The fields to update.
     * @returns The updated user.
     */
    public async execute({ id, body }: UpdateUserParams): Promise<User> {
        return this.userRepository.updateUser(id, body);
    }
}
