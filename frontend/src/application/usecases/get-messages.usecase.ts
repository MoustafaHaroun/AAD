import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";
import type { Message } from "@/domain/entities";

/**
 * Fetch all messages for the current user.
 */
export class GetMessages extends UseCaseBase<Message[]> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the messages.
     * @returns The current user's messages.
     */
    public async execute(): Promise<Message[]> {
        return this.messageRepository.getMessages();
    }
}
