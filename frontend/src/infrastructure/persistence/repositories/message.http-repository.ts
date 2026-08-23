import { apiClient } from "@/infrastructure/api";
import type { IMessageRepository } from "@/domain/repositories";
import type { Message, CreateMessageBody } from "@/domain/entities";

/**
 * Send and fetch messages via the API.
 */
export class MessageHttpRepository implements IMessageRepository {
    /**
     * Fetch the current user's messages.
     * @returns The current user's messages.
     */
    public async getMessages(): Promise<Message[]> {
        const { messages } = await apiClient.get<{ messages: Message[] }>("/messages");

        return messages;
    }

    /**
     * Fetch a single message.
     * @param id - The id of the message to fetch.
     * @returns The message.
     */
    public async getMessage(id: string): Promise<Message> {
        const { message } = await apiClient.get<{ message: Message }>(`/messages/${id}`);

        return message;
    }

    /**
     * Send a message.
     * @param body - The message data to create.
     * @returns The created message.
     */
    public async createMessage(body: CreateMessageBody): Promise<Message> {
        const { message } = await apiClient.post<{ message: Message }>("/messages", body);

        return message;
    }

    /**
     * Delete a message.
     * @param id - The id of the message to delete.
     */
    public async deleteMessage(id: string): Promise<void> {
        await apiClient.delete(`/messages/${id}`);
    }
}
