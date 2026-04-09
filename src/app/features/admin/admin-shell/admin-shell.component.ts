import { Component } from '@angular/core';
import { Sidebar, SidebarTab } from '../../../sidebar/sidebar';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [Sidebar],
  template: `<app-sidebar [sidebarTabs]="tabs" />`
})
export class AdminShellComponent {
  tabs: SidebarTab[] = [
    { label: 'Teams', icon: 'pi-users',     route: 'admin/teams' },
    { label: 'Users', icon: 'pi-user-plus', route: 'admin/users' },
    { label: 'Tasks', icon: 'pi-list',      route: 'admin/tasks' }
  ];
}
