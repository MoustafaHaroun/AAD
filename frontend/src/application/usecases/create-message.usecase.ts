import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";
import type { Message, CreateMessageBody } from "@/domain/entities";

/**
 * Send a message.
 */
export class CreateMessage extends UseCaseBase<Message, CreateMessageBody> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    /**
     * Create the message.
     * @param body - The message data to create.
     * @returns The created message.
     */
    public async execute(body: CreateMessageBody): Promise<Message> {
        return this.messageRepository.createMessage(body);
    }
}
