import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChatService } from '../../../core/services/chat.service';
import { UserService } from '../../../core/services/user.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { ChatMessage } from '../../../core/models/chat.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-member-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    SelectButtonModule,
    SelectModule,
    ScrollPanelModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './member-chat.component.html'
})
export class MemberChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  users: User[] = [];
  onlineUserIds: number[] = [];
  loading = false;
  chatSubscription!: Subscription;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  chatMode: 'team' | 'private' = 'team';
  selectedReceiverId: number | null = null;
  messageText = '';

  chatModeOptions = [
    { label: 'Team Chat', value: 'team' },
    { label: 'Private Chat', value: 'private' }
  ];

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private authState: AuthStateService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.chatSubscription = this.chatService.messageReceived$.subscribe((msg: ChatMessage) => {
      if (this.chatMode === 'team' && !msg.isPrivate) {
        if (msg.senderId !== this.currentUserId) {
          this.messages = [...this.messages, msg];
        }
      } else if (this.chatMode === 'private' && msg.isPrivate) {
        if (msg.senderId === this.selectedReceiverId || msg.receiverId === this.selectedReceiverId) {
          if (msg.senderId !== this.currentUserId) {
            this.messages = [...this.messages, msg];
          }
        }
      }
      this.scrollToBottom();
    });

    this.loadUsers();
    this.loadMessages();
    this.loadOnlineUsers();
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
    // const connId = 'http-conn-' + this.currentUserId;
    // this.chatService.disconnectUser(connId).subscribe();
  }

  loadOnlineUsers(): void {
    this.chatService.getOnlineTeamMembers().subscribe({
      next: (res) => { this.onlineUserIds = res; }
    });
  }

  loadUsers(): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (!teamId) return;

    this.userService.getTeamMembers(teamId).subscribe({
      next: (res) => {
        const current = this.authState.currentUser();
        const selfId = current?.userId;
        this.users = res.data.filter(u => u.id !== selfId);
      }
    });
  }

  loadMessages(): void {
    this.loading = true;
    if (this.chatMode === 'team') {
      const teamId = this.authState.currentUser()?.teamId;
      if (!teamId) { this.loading = false; return; }
      this.chatService.getTeamMessages(teamId).subscribe({
        next: (res) => { this.messages = res.data; this.loading = false; this.scrollToBottom(); },
        error: () => { this.loading = false; }
      });
    } else {
      if (!this.selectedReceiverId) { this.messages = []; this.loading = false; return; }
      this.chatService.getPrivateMessages(this.selectedReceiverId).subscribe({
        next: (res) => { this.messages = res.data; this.loading = false; this.scrollToBottom(); },
        error: () => { this.loading = false; }
      });
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  onModeChange(): void {
    this.messages = [];
    this.selectedReceiverId = null;
    this.loadMessages();
  }

  selectTeamChat(): void {
    this.chatMode = 'team';
    this.onModeChange();
  }

  selectUserChat(userId: number): void {
    this.chatMode = 'private';
    this.selectedReceiverId = userId;
    this.messages = [];
    this.loadMessages();
  }

  get chatTitle(): string {
    if (this.chatMode === 'team') return 'Team Chat';
    if (this.selectedReceiverId) {
      const u = this.users.find(x => x.id === this.selectedReceiverId);
      return u ? (u.fullName || u.userName) : 'Private Chat';
    }
    return 'Chat';
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!text) return;

    if (this.chatMode === 'team') {
      this.chatService.sendTeamMessage({ content: text, isPrivate: false }).subscribe({
        next: (res) => {
          this.messageText = '';
          if (res.data) {
            this.messages = [...this.messages, res.data];
            this.scrollToBottom();
          }
        }
      });
    } else {
      if (!this.selectedReceiverId) return;
      if (this.selectedReceiverId === this.currentUserId) {
        this.messageService.add({ severity: 'warn', summary: 'System', detail: 'You cannot send messages to yourself.' });
        return;
      }
      this.chatService.sendPrivateMessage(this.selectedReceiverId, {
        content: text,
        isPrivate: true,
        receiverId: this.selectedReceiverId
      }).subscribe({
        next: (res) => {
          this.messageText = '';
          if (res.data) {
            this.messages = [...this.messages, res.data];
            this.scrollToBottom();
          }
        }
      });
    }
  }

  get currentUserId(): number {
    return this.authState.currentUser()?.userId ?? 0;
  }

  get userOptions() {
    return this.users.map(u => ({ label: u.fullName || u.userName, value: u.id }));
  }
}
