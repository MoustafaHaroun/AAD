import { di, UseCaseBase } from "@/infrastructure/di";
import { USER_REPOSITORY_TOKEN, type IUserRepository } from "@/domain/repositories";
import type { User } from "@/domain/entities";

export interface GetUserParams { id: string }

/**
 * Fetch a user by id.
 */
export class GetUser extends UseCaseBase<User, GetUserParams> {
    private readonly userRepository;

    constructor() {
        super();
        this.userRepository = di.inject<IUserRepository>(USER_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the user.
     * @param params - The use case parameters.
     * @param params.id - The id of the user to fetch.
     * @returns The user.
     */
    public async execute({ id }: GetUserParams): Promise<User> {
        return this.userRepository.getUser(id);
    }
}
