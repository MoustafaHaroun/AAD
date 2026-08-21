import { useMemo } from "react";
import type { Message, MessageUser } from "@/domain/entities";
import { useGetMessages } from "@/presentation/hooks/queries/get-messages.hook";
import { useCurrentUserId } from "@/presentation/hooks/queries/current-user.hook";

export interface Conversation {
    counterpart: MessageUser,
    lastMessage: Message,
}

/**
 * Groups the flat `/messages` list into one conversation per counterpart
 * (there's no thread/conversation concept on the backend), sorted by most
 * recently active.
 */
export function useConversations() {
    const currentUserId = useCurrentUserId();
    const { data: messages, ...rest } = useGetMessages();

    const conversations = useMemo<Conversation[] | undefined>(() => {
        if (messages == null || currentUserId == null) { return undefined; }

        const byCounterpart = new Map<string, Conversation>();

        for (const message of messages) {
            const counterpart = message.sender.id === currentUserId ? message.recipient : message.sender;
            const existing = byCounterpart.get(counterpart.id);

            if (existing == null || new Date(message.createdAt) > new Date(existing.lastMessage.createdAt)) {
                byCounterpart.set(counterpart.id, { counterpart, lastMessage: message });
            }
        }

        return [...byCounterpart.values()].sort(
            (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime(),
        );
    }, [messages, currentUserId]);

    return { conversations, ...rest };
}
