import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  constructor(private api: ApiService) {}

  getConversations(): Observable<any> {
    return this.api.get('/conversation');
  }

  getConversationById(id: string): Observable<any> {
    return this.api.get(`/conversation/${id}`);
  }

  createConversation(data: any): Observable<any> {
    return this.api.post('/conversation', data);
  }

  getMessages(conversationId: string): Observable<any> {
    return this.api.get(`/message/conversation/${conversationId}`);
  }

  sendMessage(data: { conversationId: string; body: string }): Observable<any> {
    return this.api.post('/message', data);
  }

  getUnreadCount(): Observable<any> {
    return this.api.get('/message/unread/count');
  }
}
