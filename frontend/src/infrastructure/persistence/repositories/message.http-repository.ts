import { apiClient } from "@/infrastructure/api";
import type { IMessageRepository } from "@/domain/repositories";
import type { Message, CreateMessageBody } from "@/domain/entities";

export class MessageHttpRepository implements IMessageRepository {
    async getMessages(): Promise<Message[]> {
        const { messages } = await apiClient.get<{ messages: Message[] }>("/messages");

        return messages;
    }

    async getMessage(id: string): Promise<Message> {
        const { message } = await apiClient.get<{ message: Message }>(`/messages/${id}`);

        return message;
    }

    async createMessage(body: CreateMessageBody): Promise<Message> {
        const { message } = await apiClient.post<{ message: Message }>("/messages", body);

        return message;
    }

    async deleteMessage(id: string): Promise<void> {
        return apiClient.delete(`/messages/${id}`);
    }
}
