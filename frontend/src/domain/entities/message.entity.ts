export interface Message {
    id: string;
    content: string;
    recipientId: string;
}

export interface CreateMessageBody {
    content: string;
    recipientId: string;
}
