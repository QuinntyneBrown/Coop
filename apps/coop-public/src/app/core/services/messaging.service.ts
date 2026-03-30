import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map, of, catchError } from 'rxjs';

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
    return this.api.get<any>('conversations').pipe(
      map((resp: any) => {
        const items = Array.isArray(resp) ? resp : resp?.conversations ?? [];
        return items.map((c: any) => this.mapConversation(c));
      }),
      catchError(() => of([])),
    );
  }

  getConversation(id: string): Observable<Conversation> {
    return this.api.get<any>(`conversations/${id}`).pipe(
      map((resp: any) => this.mapConversation(resp?.conversation ?? resp)),
    );
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return this.api.get<any>(`conversations/${conversationId}/messages`).pipe(
      map((resp: any) => {
        const items = Array.isArray(resp) ? resp : resp?.messages ?? [];
        return items.map((m: any) => this.mapMessage(m));
      }),
      catchError(() => of([])),
    );
  }

  sendMessage(conversationId: string, content: string): Observable<Message> {
    return this.api.post<any>(`conversations/${conversationId}/messages`, { content }).pipe(
      map((resp: any) => this.mapMessage(resp?.message ?? resp)),
    );
  }

  createConversation(data: { subject: string; participantIds: string[]; initialMessage: string }): Observable<Conversation> {
    return this.api.post<any>('conversations', data).pipe(
      map((resp: any) => this.mapConversation(resp?.conversation ?? resp)),
    );
  }

  private mapConversation(c: any): Conversation {
    return {
      id: c.id || c.conversationId || '',
      subject: c.subject || 'Conversation',
      participantIds: c.participantIds || c.profileIds?.map((p: any) => String(p)) || [],
      participantNames: c.participantNames || [],
      lastMessage: c.lastMessage || '',
      lastMessageAt: c.lastMessageAt || c.createdOn || '',
      unreadCount: c.unreadCount || 0,
    };
  }

  private mapMessage(m: any): Message {
    return {
      id: m.id || m.messageId || '',
      conversationId: m.conversationId || '',
      senderId: m.senderId || m.fromProfileId || '',
      senderName: m.senderName || 'Member',
      content: m.content || m.body || '',
      createdAt: m.createdAt || m.createdOn || '',
    };
  }
}
