import { di, UseCaseBase } from "@/infrastructure/di";
import { MESSAGE_REPOSITORY_TOKEN, type IMessageRepository } from "@/domain/repositories";
import type { Message } from "@/domain/entities";

export class GetMessages extends UseCaseBase<Message[]> {
    private readonly messageRepository;

    constructor() {
        super();
        this.messageRepository = di.inject<IMessageRepository>(MESSAGE_REPOSITORY_TOKEN);
    }

    async execute(): Promise<Message[]> {
        return this.messageRepository.getMessages();
    }
}
