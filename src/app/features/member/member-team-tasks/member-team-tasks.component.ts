import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TaskService } from '../../../core/services/task.service';
import { UserService } from '../../../core/services/user.service';
import { AuthStateService } from '../../../core/services/auth-state.service';
import { Sweetalert } from '../../../core/services/Alerts/sweetalert';
import { TaskItem, CreateTaskDto, UpdateTaskDto } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskTableComponent } from '../../../shared/task-table/task-table.component';
import { TaskFormDialogComponent } from '../../../shared/task-form-dialog/task-form-dialog.component';
import { TaskEditDialogComponent } from '../../../shared/task-edit-dialog/task-edit-dialog.component';
import { TaskDetailDialogComponent } from '../../../shared/task-detail-dialog/task-detail-dialog.component';
import { TaskStatusDialogComponent } from '../../../shared/task-status-dialog/task-status-dialog.component';
import { FloatingChatComponent } from '../components/floating-chat/floating-chat.component';

@Component({
  selector: 'app-member-team-tasks',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TaskTableComponent,
    TaskFormDialogComponent,
    TaskEditDialogComponent,
    TaskDetailDialogComponent,
    TaskStatusDialogComponent,
    FloatingChatComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './member-team-tasks.component.html'
})
export class MemberTeamTasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  users: User[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  createVisible = false;
  editVisible = false;
  detailVisible = false;
  statusVisible = false;
  selectedTask: TaskItem | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authState: AuthStateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private swal: Sweetalert
  ) { }

  ngOnInit(): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (teamId) {
      this.loadTeamTasks(teamId);
      this.loadUsers();
    }
  }

  loadTeamTasks(teamId: number, pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.taskService.getTeamTasks(teamId, { pageNumber, pageSize, searchTerm: this.searchTerm }).subscribe({
      next: (res) => {
        const pagedData = res.data as any;
        this.tasks = pagedData.items;
        this.totalRecords = pagedData.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  refreshTasks(): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (teamId) {
      this.loadTeamTasks(teamId, this.currentPage, this.pageSize);
    }
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    const teamId = this.authState.currentUser()?.teamId;
    if (teamId) {
      this.loadTeamTasks(teamId, this.currentPage, this.pageSize);
    }
  }

  onPageChange(event: any): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (!teamId) return;
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadTeamTasks(teamId, this.currentPage, this.pageSize);
  }

  loadUsers(): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (!teamId) return;
    this.userService.getTeamMembers(teamId).subscribe({
      next: (res) => { this.users = res.data; }
    });
  }

  onTaskCreated(dto: CreateTaskDto): void {
    const teamId = this.authState.currentUser()?.teamId;
    this.taskService.createTask({ ...dto, teamId }).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success(res.message, 'Team Management');
          if (teamId) this.loadTeamTasks(teamId);
        } else {
          this.swal.error(res.message || 'Failed to create task', 'Team Management');
        }
      },
      error: (err) => {
        this.swal.error(err?.error?.message || err.message || 'An unexpected error occurred', 'Error');
      }
    });
  }

  onViewTask(task: TaskItem): void {
    this.selectedTask = task;
    this.detailVisible = true;
  }

  onEditStatus(task: TaskItem): void {
    this.selectedTask = task;
    this.statusVisible = true;
  }

  onEditTask(task: TaskItem): void {
    this.selectedTask = task;
    this.editVisible = true;
  }

  onStatusUpdated(): void {
    this.refreshTasks();
  }

  onDeleteTask(task: TaskItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this task "${task.title}"?`,
      accept: () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.swal.success(res.message, 'Team Management');
              const teamId = this.authState.currentUser()?.teamId;
              if (teamId) this.loadTeamTasks(teamId);
            } else {
              this.swal.error(res.message || 'Failed to delete task', 'Team Management');
            }
          },
          error: (err) => {
            this.swal.error(err?.error?.message || err.message || 'An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }
}
