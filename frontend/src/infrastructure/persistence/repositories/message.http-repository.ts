import { apiClient } from "@/infrastructure/api";
import type { IMessageRepository } from "@/domain/repositories";
import type { Message, CreateMessageBody } from "@/domain/entities";

export class MessageHttpRepository implements IMessageRepository {
    async getMessages(): Promise<Message[]> {
        return apiClient.get<Message[]>("/messages");
    }

    async getMessage(id: string): Promise<Message> {
        return apiClient.get<Message>(`/messages/${id}`);
    }

    async createMessage(body: CreateMessageBody): Promise<Message> {
        return apiClient.post<Message>("/messages", body);
    }

    async deleteMessage(id: string): Promise<void> {
        return apiClient.delete(`/messages/${id}`);
    }
}
