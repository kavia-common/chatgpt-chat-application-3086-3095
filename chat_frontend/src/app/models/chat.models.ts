export interface Chat {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  content: string;
  createdAt: string;
  role?: 'user' | 'assistant' | 'system';
}

export interface CreateChatRequest {
  title?: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
}
