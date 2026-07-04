import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";

export type DeleteMessageParams = { id: string };

export class DeleteMessage extends UseCaseBase<void, DeleteMessageParams> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    async execute({ id }: DeleteMessageParams): Promise<void> {
        return this.messageRepository.deleteMessage(id);
    }
}
