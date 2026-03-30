import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  constructor(private api: ApiService) {}

  getConversations(): Observable<any> {
    return this.api.get('/conversations/by-profile/00000000-0000-0000-0000-000000000000');
  }

  getConversationById(id: string): Observable<any> {
    return this.api.get(`/conversations/${id}`);
  }

  createConversation(data: any): Observable<any> {
    return this.api.post('/conversations', data);
  }

  getMessages(conversationId: string): Observable<any> {
    return this.api.get(`/messages/by-conversation/${conversationId}`);
  }

  sendMessage(data: { conversationId: string; body: string }): Observable<any> {
    return this.api.post(`/conversations/${data.conversationId}/messages`, { body: data.body });
  }

  getUnreadCount(): Observable<any> {
    return this.api.get('/messages/unread-count/00000000-0000-0000-0000-000000000000');
  }
}
