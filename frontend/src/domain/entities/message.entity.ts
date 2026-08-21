export interface MessageUser {
    id: string,
    firstname: string,
    surname: string,
    avatar?: string | null,
}

export interface Message {
    id: string,
    content: string,
    createdAt: string,
    sender: MessageUser,
    recipient: MessageUser,
}

export interface CreateMessageBody {
    content: string,
    recipientId: string,
}
