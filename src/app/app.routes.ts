import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // Admin section
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    children: [
      { path: '', redirectTo: 'teams', pathMatch: 'full' },
      {
        path: 'teams',
        loadComponent: () =>
          import('./features/admin/admin-teams/admin-teams.component').then(m => m.AdminTeamsComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/admin/admin-tasks/admin-tasks.component').then(m => m.AdminTasksComponent)
      }
    ]
  },

  // Member section
  {
    path: 'member',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/member/member-shell/member-shell.component').then(m => m.MemberShellComponent),
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/member/member-tasks/member-tasks.component').then(m => m.MemberTasksComponent)
      },
      {
        path: 'team-tasks',
        loadComponent: () =>
          import('./features/member/member-team-tasks/member-team-tasks.component').then(m => m.MemberTeamTasksComponent)
      },
      {
        path: 'chat',
        loadComponent: () =>
          import('./features/member/member-chat/member-chat.component').then(m => m.MemberChatComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
