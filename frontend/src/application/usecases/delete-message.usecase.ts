import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";

export interface DeleteMessageParams { id: string }

/**
 * Delete a message.
 */
export class DeleteMessage extends UseCaseBase<void, DeleteMessageParams> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    /**
     * Delete the message.
     * @param params - The use case parameters.
     * @param params.id - The id of the message to delete.
     */
    public async execute({ id }: DeleteMessageParams): Promise<void> {
        await this.messageRepository.deleteMessage(id);
    }
}
