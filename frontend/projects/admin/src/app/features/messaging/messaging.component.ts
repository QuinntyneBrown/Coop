import {
  Component,
  ElementRef,
  OnInit,
  inject,
  ChangeDetectionStrategy,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardTitleComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  DialogPanelComponent,
  DialogTitleComponent,
  EmptyStateComponent,
  EmptyStateIconComponent,
  EmptyStateTextComponent,
  FieldHelpComponent,
  FieldLabelComponent,
  FormFieldComponent,
  IconComponent,
  ListBodyComponent,
  ListComponent,
  ListItemComponent,
  ListMetaComponent,
  ListTitleComponent,
  LoadingComponent,
  SearchFieldComponent,
  SpinnerComponent,
  TextFieldComponent,
} from 'components';
import { MessagingService } from '../../core/services/messaging.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    FormsModule,
    IconComponent,
    ButtonComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    CardTitleComponent,
    EmptyStateComponent,
    EmptyStateIconComponent,
    EmptyStateTextComponent,
    ListBodyComponent,
    ListComponent,
    ListItemComponent,
    ListMetaComponent,
    ListTitleComponent,
    LoadingComponent,
    SpinnerComponent,
    FieldHelpComponent,
    FieldLabelComponent,
    FormFieldComponent,
    SearchFieldComponent,
    TextFieldComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogFooterComponent,
    DialogHeaderComponent,
    DialogPanelComponent,
    DialogTitleComponent,
  ],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MessagingComponent implements OnInit {
  private messagingService = inject(MessagingService);
  private authService = inject(AuthService);
  private readonly newConversationDialog = viewChild<unknown, ElementRef<HTMLDialogElement>>(
    'newConversationDialog',
    { read: ElementRef },
  );

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
        next: (res: any) => {
          // Show the saved message as the API names its sender, like the others.
          this.messages.push(
            res?.message ?? {
              body,
              senderId: this.authService.currentUser?.userId,
              createdBy: this.authService.currentUser?.username,
              createdOn: new Date().toISOString(),
            },
          );
          this.messageInput.reset();
        },
        error: () => {},
      });
  }

  backToList(): void {
    this.selectedConversation = null;
  }

  isOwnMessage(msg: any): boolean {
    const user = this.authService.currentUser;
    if (msg.senderId && user?.userId) return msg.senderId === user.userId;
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

  openNewConversationDialog(): void {
    this.showNewConversationDialog = true;
    this.newConversationDialog()?.nativeElement.showModal();
  }

  closeNewConversationDialog(): void {
    this.showNewConversationDialog = false;
    this.newConversationDialog()?.nativeElement.close();
  }

  startNewConversation(): void {
    this.closeNewConversationDialog();
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
