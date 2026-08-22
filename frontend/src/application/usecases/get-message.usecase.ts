import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";
import type { Message } from "@/domain/entities";

export interface GetMessageParams { id: string }

/**
 * Fetch a single message.
 */
export class GetMessage extends UseCaseBase<Message, GetMessageParams> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    /**
     * Fetch the message.
     * @param params - The use case parameters.
     * @param params.id - The id of the message to fetch.
     * @returns The message.
     */
    public async execute({ id }: GetMessageParams): Promise<Message> {
        return this.messageRepository.getMessage(id);
    }
}
