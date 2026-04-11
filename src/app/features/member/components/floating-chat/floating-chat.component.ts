import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ChatService } from '../../../../core/services/chat.service';
import { Subscription } from 'rxjs';
import { MemberChatComponent } from '../../member-chat/member-chat.component';

@Component({
  selector: 'app-floating-chat',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, MemberChatComponent],
  templateUrl: './floating-chat.component.html'
})
export class FloatingChatComponent implements OnInit, OnDestroy {
  visible = false;
  unreadCount = 0;
  lastUnreadMessage: any = null;
  private sub!: Subscription;

  @ViewChild('memberChat') memberChat!: MemberChatComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.sub = this.chatService.triggerPopup$.subscribe((userId: number | null) => {
      this.visible = true;
      this.lastUnreadMessage = null;
      if (userId) {
        //wait for dialog and component to initialize
        setTimeout(() => {
          if (this.memberChat) {
             this.memberChat.selectUserChat(userId);
          }
        }, 100);
      }
    });

    this.chatService.unreadCount$.subscribe((count: number) => {
       this.unreadCount = count;
    });

    this.chatService.unreadMessages$.subscribe((messages) => {
      this.lastUnreadMessage = messages.length > 0 ? messages[0] : null;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  toggleChat() {
    this.visible = !this.visible;
    if (this.visible) {
       this.chatService.clearUnread();
       this.lastUnreadMessage = null;
    }
  }

  onDialogShow() {
     if (this.visible) {
       this.chatService.clearUnread();
       this.lastUnreadMessage = null;
     }
  }
}
