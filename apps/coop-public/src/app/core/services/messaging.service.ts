import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

export interface Conversation {
  id: string;
  subject: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class MessagingService {
  private api = inject(ApiService);

  getConversations(): Observable<Conversation[]> {
    return this.api.get<Conversation[]>('conversations');
  }

  getConversation(id: string): Observable<Conversation> {
    return this.api.get<Conversation>(`conversations/${id}`);
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return this.api.get<Message[]>(`conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    return this.api.post<Message>(`conversations/${conversationId}/messages`, { content });
  }

  createConversation(data: { subject: string; participantIds: string[]; initialMessage: string }): Observable<Conversation> {
    return this.api.post<Conversation>('conversations', data);
  }
}
