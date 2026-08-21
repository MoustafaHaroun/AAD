import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User, RNFile } from "@/domain/entities";

export interface UploadUserAvatarParams { id: string, file: RNFile }

export class UploadUserAvatar extends UseCaseBase<User, UploadUserAvatarParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    async execute({ id, file }: UploadUserAvatarParams): Promise<User> {
        return this.userRepository.uploadAvatar(id, file);
    }
}
