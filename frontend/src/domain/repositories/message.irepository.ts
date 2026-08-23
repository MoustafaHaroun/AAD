import type { Message, CreateMessageBody } from "@/domain/entities";

export const MESSAGE_REPOSITORY_TOKEN = Symbol("IMessageRepository");

export interface IMessageRepository {
    getMessages: () => Promise<Message[]>,
    getMessage: (id: string) => Promise<Message>,
    createMessage: (body: CreateMessageBody) => Promise<Message>,
    deleteMessage: (id: string) => Promise<void>,
}
