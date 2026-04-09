import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStateService } from '../core/services/auth-state.service';
import { ChatService } from '../core/services/chat.service';
import { ChatMessage } from '../core/models/chat.model';

export interface SidebarTab {
  label: string;
  icon: string;  // PrimeIcons class e.g. 'pi-list'
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  @Input() sidebarTabs: SidebarTab[] = [];

  activeIndex: number = 0;
  unreadCount: number = 0;
  latestUnreadSenderId: number | null = null;

  constructor(
    private router: Router,
    private authState: AuthStateService,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatService.startConnection();

    this.chatService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });

    this.chatService.unreadMessages$.subscribe((msgs: ChatMessage[]) => {
      if (msgs.length > 0) {
        this.latestUnreadSenderId = msgs[0].senderId;
      } else {
        this.latestUnreadSenderId = null;
      }
    });

    // Sync active tab on navigation
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const currentUrl = event.urlAfterRedirects;
        const foundIndex = this.sidebarTabs.findIndex((tab) =>
          currentUrl.startsWith('/' + tab.route)
        );
        if (foundIndex !== -1) {
          this.activeIndex = foundIndex;
        }
      });

    // Set initial active tab from current URL
    const currentUrl = this.router.url;
    const foundIndex = this.sidebarTabs.findIndex((tab) =>
      currentUrl.startsWith('/' + tab.route)
    );
    if (foundIndex !== -1) {
      this.activeIndex = foundIndex;
    }
  }

  setActiveTab(index: number): void {
    this.activeIndex = index;
    this.router.navigate(['/' + this.sidebarTabs[index].route]);
  }

  get isAdmin(): boolean {
    return this.authState.isAdmin();
  }

  get username(): string {
    return this.authState.currentUser()?.userName ?? '';
  }

  get role(): string {
    return this.authState.currentUser()?.role ?? '';
  }

  logout(): void {
    this.chatService.stopConnection();
    this.authState.logout();
  }

  openLatestNotification() {
    if (this.unreadCount > 0 && this.latestUnreadSenderId) {
      this.chatService.openChatPopup(this.latestUnreadSenderId);
    }
  }
}
