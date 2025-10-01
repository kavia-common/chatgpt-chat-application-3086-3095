/* global WebSocket:readonly, URL:readonly, window:readonly, setTimeout:readonly */
import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Chat, ChatMessage, CreateChatRequest, SendMessageRequest } from '../models/chat.models';
import { environment } from '../../environments/environment';

// PUBLIC_INTERFACE
/** ChatService manages chats via REST and real-time messages via WebSocket. */
@Injectable({ providedIn: 'root' })
export class ChatService {
  chats = signal<Chat[]>([]);
  activeChatId = signal<string | null>(null);
  messages = signal<Record<string, ChatMessage[]>>({});

  private ws?: WebSocket;
  private wsConnected = signal<boolean>(false);

  constructor(private api: ApiService) {}

  // PUBLIC_INTERFACE
  /** Initialize WebSocket connection. Reconnect on close. */
  connect() {
    if (typeof window === 'undefined') return; // SSR guard
    const token = this.api.getToken();
    if (!token) return;
    const url = new URL(environment.wsUrl, window.location.origin);
    url.searchParams.set('token', token);
    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => this.wsConnected.set(true);
    this.ws.onclose = () => {
      this.wsConnected.set(false);
      if (typeof setTimeout !== 'undefined') {
        setTimeout(() => this.connect(), 1000);
      }
    };
    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === 'message') {
          const msg = data.payload as ChatMessage;
          const map = this.messages();
          map[msg.chatId] = [...(map[msg.chatId] || []), msg];
          this.messages.set({ ...map });
        } else if (data.type === 'chat_updated') {
          this.refreshChats();
        }
      } catch {}
    };
  }

  // PUBLIC_INTERFACE
  /** Fetch chats list. */
  async refreshChats() {
    const list = await this.api.get<Chat[]>('/chats');
    // sort by updatedAt desc
    list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    this.chats.set(list);
  }

  // PUBLIC_INTERFACE
  /** Load messages for a chat. */
  async loadMessages(chatId: string) {
    const msg = await this.api.get<ChatMessage[]>(`/chats/${chatId}/messages`);
    const map = this.messages();
    map[chatId] = msg;
    this.messages.set({ ...map });
    this.activeChatId.set(chatId);
  }

  // PUBLIC_INTERFACE
  /** Create a new chat */
  async createChat(req: CreateChatRequest = {}) {
    const chat = await this.api.post<Chat>('/chats', req);
    await this.refreshChats();
    this.activeChatId.set(chat.id);
    await this.loadMessages(chat.id);
    return chat;
  }

  // PUBLIC_INTERFACE
  /** Send a message */
  async sendMessage(req: SendMessageRequest) {
    const msg = await this.api.post<ChatMessage>(`/chats/${req.chatId}/messages`, { content: req.content });
    const map = this.messages();
    map[req.chatId] = [...(map[req.chatId] || []), msg];
    this.messages.set({ ...map });
    return msg;
  }
}
