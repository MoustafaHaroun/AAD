import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";
import type { Message } from "@/domain/entities";

export type GetMessageParams = { id: string };

export class GetMessage extends UseCaseBase<Message, GetMessageParams> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    async execute({ id }: GetMessageParams): Promise<Message> {
        return this.messageRepository.getMessage(id);
    }
}
