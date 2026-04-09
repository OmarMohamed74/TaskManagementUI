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
  private sub!: Subscription;

  @ViewChild('memberChat') memberChat!: MemberChatComponent;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.sub = this.chatService.triggerPopup$.subscribe((userId: number | null) => {
      this.visible = true;
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
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  toggleChat() {
    this.visible = !this.visible;
    if (this.visible) {
       this.chatService.clearUnread();
    }
  }

  onDialogShow() {
     if (this.visible) {
       this.chatService.clearUnread();
     }
  }
}
