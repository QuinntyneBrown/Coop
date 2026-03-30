import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagingService, Conversation, Message } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messaging-page">
      <!-- Loading -->
      <div class="loading" *ngIf="loading" data-testid="messaging-loading">
        <div class="spinner"></div>
      </div>

      <h1 data-testid="messaging-page-title">Messages</h1>

      <!-- Conversation List -->
      <div class="conversation-list" data-testid="messaging-conversation-list" *ngIf="!selectedConversation">
        <div
          class="conversation-item card"
          *ngFor="let conv of conversations"
          data-testid="messaging-conversation-item"
          (click)="openConversation(conv)"
        >
          <div class="conv-header">
            <span class="conv-subject" data-testid="messaging-conversation-subject">{{ conv.subject }}</span>
            <span class="conv-time" data-testid="messaging-conversation-timestamp">{{ conv.lastMessageAt | date:'shortDate' }}</span>
          </div>
          <p class="conv-preview" data-testid="messaging-conversation-preview">{{ conv.lastMessage }}</p>
          <span class="unread-badge" *ngIf="conv.unreadCount > 0" data-testid="messaging-unread-badge">{{ conv.unreadCount }}</span>
        </div>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="!loading && conversations.length === 0" data-testid="messaging-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>No conversations yet</p>
        </div>
      </div>

      <!-- Chat Panel -->
      <div class="chat-panel" *ngIf="selectedConversation" data-testid="messaging-chat-panel">
        <div class="chat-header">
          <button class="back-btn" data-testid="messaging-back-to-list" (click)="backToList()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div class="chat-info">
            <h2 data-testid="messaging-chat-subject">{{ selectedConversation.subject }}</h2>
            <span class="participants" data-testid="messaging-chat-participants">
              {{ selectedConversation.participantNames?.join(', ') || 'Participants' }}
            </span>
          </div>
        </div>

        <!-- Messages -->
        <div class="message-list" data-testid="messaging-message-list">
          <div
            class="message-bubble"
            *ngFor="let msg of messages"
            [class.own]="msg.senderId === currentUserId"
            data-testid="messaging-message-bubble"
          >
            <span class="message-sender" data-testid="messaging-message-sender">{{ msg.senderName }}</span>
            <p data-testid="messaging-message-content">{{ msg.content }}</p>
            <span class="message-time" data-testid="messaging-message-timestamp">{{ msg.createdAt | date:'shortTime' }}</span>
          </div>
        </div>

        <!-- Send Message -->
        <div class="message-input-area">
          <input
            type="text"
            data-testid="messaging-message-input"
            [(ngModel)]="newMessage"
            placeholder="Type a message..."
            (keyup.enter)="sendMessage()"
          />
          <button class="btn btn-primary send-btn" data-testid="messaging-send-btn" (click)="sendMessage()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messaging-page {
      padding: 24px 16px;
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 140px);
    }

    h1 {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .conversation-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .conversation-item {
      cursor: pointer;
      transition: box-shadow 0.2s;
      position: relative;

      &:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    }

    .conv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .conv-subject {
      font-size: 15px;
      font-weight: 500;
    }

    .conv-time {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .conv-preview {
      font-size: 13px;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .unread-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: var(--primary);
      color: white;
      font-size: 11px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
      color: var(--text-secondary);
      svg { margin-bottom: 12px; }
    }

    .loading { display: flex; justify-content: center; padding: 48px; }
    .spinner {
      width: 32px; height: 32px;
      border: 3px solid var(--border); border-top-color: var(--primary);
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Chat panel */
    .chat-panel {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 16px;

      h2 { font-size: 18px; font-weight: 600; }
    }

    .back-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 8px;
      color: var(--text-primary);
      &:hover { background: var(--primary-light); }
    }

    .participants {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .message-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
      overflow-y: auto;
      min-height: 200px;
    }

    .message-bubble {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      align-self: flex-start;

      &.own {
        align-self: flex-end;
        background: var(--primary);
        color: white;
        border-color: var(--primary);

        .message-sender { color: rgba(255,255,255,0.8); }
        .message-time { color: rgba(255,255,255,0.7); }
      }

      .message-sender {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-secondary);
        display: block;
        margin-bottom: 2px;
      }

      p { font-size: 14px; line-height: 1.4; }

      .message-time {
        font-size: 11px;
        color: var(--text-secondary);
        display: block;
        margin-top: 4px;
        text-align: right;
      }
    }

    .message-input-area {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--border);

      input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid var(--border);
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        &:focus { border-color: var(--primary); }
      }
    }

    .send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
  `],
})
export class MessagingComponent implements OnInit {
  private messagingService = inject(MessagingService);
  private authService = inject(AuthService);

  conversations: Conversation[] = [];
  messages: Message[] = [];
  selectedConversation: Conversation | null = null;
  newMessage = '';
  loading = true;
  currentUserId = '';

  ngOnInit() {
    this.currentUserId = this.authService.currentUser?.userId || '';
    this.loadConversations();
  }

  loadConversations() {
    this.loading = true;
    this.messagingService.getConversations().pipe(
      catchError(() => of([])),
    ).subscribe(conversations => {
      this.conversations = conversations;
      this.loading = false;
    });
  }

  openConversation(conv: Conversation) {
    this.selectedConversation = conv;
    this.messagingService.getMessages(conv.id).pipe(
      catchError(() => of([])),
    ).subscribe(messages => {
      this.messages = messages;
    });
  }

  backToList() {
    this.selectedConversation = null;
    this.messages = [];
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const content = this.newMessage;
    this.newMessage = '';

    this.messagingService.sendMessage(this.selectedConversation.id, content).subscribe({
      next: (msg) => {
        this.messages = [...this.messages, msg];
      },
      error: () => {},
    });
  }
}
