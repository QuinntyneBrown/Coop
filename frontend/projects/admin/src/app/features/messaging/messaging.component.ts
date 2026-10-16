import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MessagingService } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';
import { BottomTabBarComponent } from '../../shared/components/bottom-tab-bar.component';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BottomTabBarComponent],
  template: `
    <div class="messaging-page">
      <div class="page-header">
        <h1 data-testid="messaging-page-title">Messages</h1>
      </div>

      @if (loading) {
        <div data-testid="messaging-loading" class="loading">
          <span class="material-icons spin">sync</span>
        </div>
      }

      <div class="messaging-layout">
        <!-- Conversation List -->
        <div
          class="conversation-list-panel"
          [class.hidden-mobile]="selectedConversation"
          data-testid="conversation-list"
        >
          <h2 data-testid="conversation-list-title">Messages</h2>
          <div class="conv-toolbar">
            <input
              type="text"
              class="conv-search-input"
              placeholder="Search conversations..."
              data-testid="conversation-search"
              (input)="onSearchConversations($event)"
            />
            <button
              class="btn btn-primary btn-sm"
              data-testid="new-conversation-button"
              (click)="showNewConversationDialog = true"
            >
              <span class="material-icons">add</span>
            </button>
          </div>

          @for (conv of filteredConversations; track conv; let i = $index) {
            <div
              class="conversation-item"
              data-testid="conversation-item"
              [class.selected]="selectedConversation?.conversationId === conv.conversationId"
              (click)="openConversation(conv)"
            >
              <div class="conv-avatar">{{ getInitial(conv) }}</div>
              <div class="conv-info">
                <span class="conv-subject" data-testid="conversation-name">{{
                  conv.subject || conv.title || 'Conversation'
                }}</span>
                <span class="conv-preview" data-testid="conversation-preview">{{
                  conv.lastMessage?.body || conv.preview || ''
                }}</span>
              </div>
              <div class="conv-meta">
                <span class="conv-time" data-testid="conversation-time">{{
                  conv.lastMessage?.createdOn || conv.updatedOn | date: 'shortTime'
                }}</span>
                @if (conv.unreadCount > 0) {
                  <span class="unread-badge" data-testid="unread-indicator">{{
                    conv.unreadCount
                  }}</span>
                }
              </div>
            </div>
          }

          @if (!loading && filteredConversations.length === 0) {
            <div class="empty-state">
              <span class="material-icons">chat_bubble_outline</span>
              <p>No conversations yet</p>
            </div>
          }
        </div>

        <!-- Empty State when no conversation selected -->
        @if (!selectedConversation) {
          <div class="chat-panel empty-chat" data-testid="chat-empty-state">
            <div class="empty-state">
              <span class="material-icons">chat_bubble_outline</span>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        }

        <!-- Chat Panel -->
        @if (selectedConversation) {
          <div class="chat-panel" data-testid="chat-panel">
            <div class="chat-header" data-testid="chat-header">
              <button class="back-btn" (click)="backToList()">
                <span class="material-icons">arrow_back</span>
              </button>
              <div class="chat-avatar" data-testid="chat-header-avatar">
                {{ getInitial(selectedConversation) }}
              </div>
              <div class="chat-info">
                <span class="chat-subject" data-testid="chat-header-name">{{
                  selectedConversation.subject || 'Conversation'
                }}</span>
                <span class="chat-participants">{{ getParticipants(selectedConversation) }}</span>
              </div>
            </div>
            <div class="message-list">
              @for (msg of messages; track msg) {
                <div
                  class="message-bubble"
                  data-testid="message-bubble"
                  [class.own]="isOwnMessage(msg)"
                  [class.other]="!isOwnMessage(msg)"
                >
                  <span class="msg-sender">{{ msg.createdBy || msg.sender || 'User' }}</span>
                  <p>{{ msg.body || msg.content }}</p>
                  <span class="msg-time">{{ msg.createdOn | date: 'shortTime' }}</span>
                </div>
              }
            </div>
            <div class="message-input-bar">
              <input
                type="text"
                [formControl]="messageInput"
                placeholder="Type a message..."
                data-testid="message-input"
                (keyup.enter)="sendMessage()"
              />
              <button
                class="btn btn-primary send-btn"
                data-testid="message-send-button"
                (click)="sendMessage()"
              >
                <span class="material-icons">send</span>
              </button>
            </div>
          </div>
        }

        <!-- New Conversation Dialog -->
        @if (showNewConversationDialog) {
          <div class="modal-overlay" data-testid="new-conversation-dialog">
            <div class="modal-content card">
              <h3>New Conversation</h3>
              <div class="form-group">
                <label for="new-conversation-recipient">Recipient</label>
                <input
                  id="new-conversation-recipient"
                  type="text"
                  placeholder="Member's username"
                  aria-describedby="new-conversation-recipient-hint"
                  data-testid="new-conversation-recipient"
                  [(ngModel)]="newConversationRecipient"
                />
                <p id="new-conversation-recipient-hint" class="form-hint">
                  Type the username of the member you want to message.
                </p>
              </div>
              <div class="modal-actions">
                <button
                  class="btn btn-secondary"
                  data-testid="new-conversation-cancel"
                  (click)="showNewConversationDialog = false"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-primary"
                  data-testid="new-conversation-start"
                  (click)="startNewConversation()"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <app-bottom-tab-bar class="mobile-only"></app-bottom-tab-bar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .messaging-page {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #f5f4f1;
      }
      .page-header {
        padding: 20px 24px;
        h1 {
          font-size: 24px;
          font-weight: 600;
        }
      }
      .messaging-layout {
        display: flex;
        flex: 1;
        min-height: 0;
      }
      .conversation-list-panel {
        width: 360px;
        background: #fff;
        border-right: 1px solid #e5e4e1;
        overflow-y: auto;
        flex-shrink: 0;
      }
      .conversation-list-panel h2 {
        padding: 16px 20px 0;
        font-size: 18px;
        font-weight: 600;
      }
      .conv-toolbar {
        display: flex;
        gap: 8px;
        padding: 12px 20px;
      }
      .conv-search-input {
        flex: 1;
        min-width: 0;
        padding: 8px 14px;
        border: 1px solid #e5e4e1;
        border-radius: 8px;
        font-size: 14px;
        &:focus {
          outline: none;
          border-color: #3d8a5a;
        }
      }
      .form-group {
        margin-bottom: 16px;
        label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid #e5e4e1;
          border-radius: 8px;
          font-size: 14px;
          &:focus {
            outline: none;
            border-color: #3d8a5a;
          }
        }
      }
      .form-hint {
        margin: 6px 0 0;
        font-size: 14px;
        color: #1a1918cc;
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content {
        width: 100%;
        max-width: 400px;
        padding: 32px;
        h3 {
          margin-bottom: 20px;
        }
      }
      .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
      }
      .conversation-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        cursor: pointer;
        border-bottom: 1px solid #f5f4f1;
        transition: background 0.2s;
        &:hover {
          background: #f5f4f1;
        }
        &.selected {
          background: rgba(61, 138, 90, 0.05);
          border-left: 3px solid #3d8a5a;
        }
      }
      .conv-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #3d8a5a;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        flex-shrink: 0;
      }
      .conv-info {
        flex: 1;
        min-width: 0;
      }
      .conv-subject {
        display: block;
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .conv-preview {
        display: block;
        font-size: 13px;
        color: #1a1918cc;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .conv-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }
      .conv-time {
        font-size: 11px;
        color: #1a1918cc;
      }
      .unread-badge {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3d8a5a;
        color: #fff;
        font-size: 11px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .chat-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fff;
      }
      .chat-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        border-bottom: 1px solid #e5e4e1;
      }
      .back-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        display: none;
      }
      .chat-avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: #3d8a5a;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }
      .chat-info {
        flex: 1;
      }
      .chat-subject {
        display: block;
        font-weight: 600;
        font-size: 15px;
      }
      .chat-participants {
        display: block;
        font-size: 12px;
        color: #1a1918cc;
      }
      .message-list {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .message-bubble {
        max-width: 70%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        &.other {
          background: #f5f4f1;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }
        &.own {
          background: #3d8a5a;
          color: #fff;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }
      }
      .msg-sender {
        display: block;
        font-size: 11px;
        font-weight: 600;
        margin-bottom: 4px;
        opacity: 0.7;
      }
      .msg-time {
        display: block;
        font-size: 10px;
        margin-top: 4px;
        opacity: 0.6;
      }
      .message-input-bar {
        display: flex;
        gap: 8px;
        padding: 12px 20px;
        border-top: 1px solid #e5e4e1;
        input {
          flex: 1;
          padding: 10px 16px;
          border: 1px solid #e5e4e1;
          border-radius: 24px;
          font-size: 14px;
          &:focus {
            outline: none;
            border-color: #3d8a5a;
          }
        }
      }
      .send-btn {
        border-radius: 50%;
        width: 42px;
        height: 42px;
        padding: 0;
      }
      .empty-state {
        padding: 40px;
        text-align: center;
        color: #1a1918cc;
        .material-icons {
          font-size: 48px;
          margin-bottom: 8px;
        }
      }
      .loading {
        text-align: center;
        padding: 40px;
      }
      .spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
      .mobile-only {
        display: none;
      }
      @media (max-width: 768px) {
        .messaging-page {
          display: block;
          height: auto;
          min-height: 100vh;
          padding-bottom: 72px;
        }
        .messaging-layout {
          height: calc(100vh - 80px);
        }
        .conversation-list-panel {
          width: 100%;
        }
        .conversation-list-panel.hidden-mobile {
          display: none;
        }
        .chat-panel.empty-chat {
          display: none;
        }
        .chat-panel {
          min-width: 0;
        }
        .back-btn {
          display: block;
        }
        .mobile-only {
          display: block;
        }
      }
    `,
  ],
})
export class MessagingComponent implements OnInit {
  private messagingService = inject(MessagingService);
  private authService = inject(AuthService);

  conversations: any[] = [];
  filteredConversations: any[] = [];
  messages: any[] = [];
  selectedConversation: any = null;
  loading = true;
  messageInput = new FormControl('');
  showNewConversationDialog = false;
  newConversationRecipient = '';

  ngOnInit(): void {
    this.loadConversations();
  }

  private loadConversations(): void {
    this.loading = true;
    this.messagingService.getConversations().subscribe({
      next: (data: any) => {
        this.conversations = Array.isArray(data) ? data : data?.conversations || [];
        this.filteredConversations = [...this.conversations];
        this.loading = false;
      },
      error: () => {
        this.conversations = [];
        this.filteredConversations = [];
        this.loading = false;
      },
    });
  }

  openConversation(conv: any): void {
    this.selectedConversation = conv;
    this.messages = [];
    if (conv.conversationId && conv.unreadCount > 0) {
      conv.unreadCount = 0;
      this.messagingService.markConversationRead(conv.conversationId).subscribe({
        error: () => {},
      });
    }
    if (conv.conversationId) {
      this.messagingService.getMessages(conv.conversationId).subscribe({
        next: (data: any) => {
          this.messages = Array.isArray(data) ? data : data?.messages || [];
        },
        error: () => {},
      });
    }
  }

  sendMessage(): void {
    const body = this.messageInput.value;
    if (!body || !this.selectedConversation?.conversationId) return;
    this.messagingService
      .sendMessage({
        conversationId: this.selectedConversation.conversationId,
        body,
      })
      .subscribe({
        next: () => {
          this.messages.push({
            body,
            createdBy: this.authService.currentUser?.username,
            createdOn: new Date().toISOString(),
          });
          this.messageInput.reset();
        },
        error: () => {},
      });
  }

  backToList(): void {
    this.selectedConversation = null;
  }

  isOwnMessage(msg: any): boolean {
    return (
      msg.createdBy === this.authService.currentUser?.username ||
      msg.sender === this.authService.currentUser?.username
    );
  }

  onSearchConversations(event: any): void {
    const query = (event.target.value || '').toLowerCase();
    if (!query) {
      this.filteredConversations = [...this.conversations];
      return;
    }
    this.filteredConversations = this.conversations.filter((c) =>
      (c.subject || c.title || '').toLowerCase().includes(query),
    );
  }

  startNewConversation(): void {
    this.showNewConversationDialog = false;
    this.newConversationRecipient = '';
  }

  getInitial(conv: any): string {
    const name = conv.subject || conv.title || 'C';
    return name.charAt(0).toUpperCase();
  }

  getParticipants(conv: any): string {
    if (conv.participants && Array.isArray(conv.participants)) {
      return conv.participants.map((p: any) => p.username || p.name || p).join(', ');
    }
    return '';
  }
}
