import { Component } from '@angular/core';
import { Sidebar, SidebarTab } from '../../../sidebar/sidebar';

@Component({
  selector: 'app-member-shell',
  standalone: true,
  imports: [Sidebar],
  template: `<app-sidebar [sidebarTabs]="tabs" />`
})
export class MemberShellComponent {
  tabs: SidebarTab[] = [
    { label: 'My Tasks',   icon: 'pi-list',      route: 'member/tasks' },
    { label: 'Team Tasks', icon: 'pi-users',      route: 'member/team-tasks' },
    { label: 'Chat',       icon: 'pi-comments',   route: 'member/chat' }
  ];
}
