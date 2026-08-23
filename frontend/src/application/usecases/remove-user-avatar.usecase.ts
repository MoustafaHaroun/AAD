import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";

export interface RemoveUserAvatarParams { id: string }

/**
 * Remove a user's avatar image.
 */
export class RemoveUserAvatar extends UseCaseBase<void, RemoveUserAvatarParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Remove the avatar.
     * @param params - The use case parameters.
     * @param params.id - The id of the user.
     */
    public async execute({ id }: RemoveUserAvatarParams): Promise<void> {
        await this.userRepository.removeAvatar(id);
    }
}
