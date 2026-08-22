import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, RNFile } from "@/domain/entities";

export interface UploadUserAvatarParams { id: string, file: RNFile }

/**
 * Upload a user's avatar image.
 */
export class UploadUserAvatar extends UseCaseBase<User, UploadUserAvatarParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Upload the avatar.
     * @param params - The use case parameters.
     * @param params.id - The id of the user.
     * @param params.file - The avatar image file.
     * @returns The updated user.
     */
    public async execute({ id, file }: UploadUserAvatarParams): Promise<User> {
        return this.userRepository.uploadAvatar(id, file);
    }
}
