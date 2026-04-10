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
import { TaskItem, CreateTaskDto, UpdateTaskStatusDto } from '../../../core/models/task.model';
import { User } from '../../../core/models/user.model';
import { TaskTableComponent } from '../../../shared/task-table/task-table.component';
import { TaskFormDialogComponent } from '../../../shared/task-form-dialog/task-form-dialog.component';
import { TaskDetailDialogComponent } from '../../../shared/task-detail-dialog/task-detail-dialog.component';
import { TaskStatusDialogComponent } from '../../../shared/task-status-dialog/task-status-dialog.component';
import { FloatingChatComponent } from '../components/floating-chat/floating-chat.component';

@Component({
  selector: 'app-member-tasks',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    TaskTableComponent,
    TaskFormDialogComponent,
    TaskDetailDialogComponent,
    TaskStatusDialogComponent,
    FloatingChatComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './member-tasks.component.html'
})
export class MemberTasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  users: User[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  createVisible = false;
  detailVisible = false;
  statusVisible = false;
  selectedTask: TaskItem | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authState: AuthStateService,
    private confirmationService: ConfirmationService,
    private swal: Sweetalert
  ) { }

  ngOnInit(): void {
    this.loadMyTasks();
    this.loadUsers();
  }

  loadMyTasks(pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.taskService.getMyTasks({ pageNumber, pageSize, searchTerm: this.searchTerm }).subscribe({
      next: (res) => {
        const pagedData = res.data as any;
        this.tasks = pagedData.items;
        this.totalRecords = pagedData.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadMyTasks(this.currentPage, this.pageSize);
  }

  onPageChange(event: any): void {
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadMyTasks(this.currentPage, this.pageSize);
  }

  loadUsers(): void {
    const teamId = this.authState.currentUser()?.teamId;
    if (!teamId) return;
    this.userService.getTeamMembers(teamId).subscribe({
      next: (res) => { this.users = res.data; }
    });
  }

  onTaskCreated(dto: CreateTaskDto): void {
    this.taskService.createTask(dto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success('Task created successfully', 'Task Management');
          this.loadMyTasks();
        } else {
          this.swal.error(res.message || 'Failed to create task', 'Task Management');
        }
      },
      error: (err) => {
        this.swal.error('An unexpected error occurred', 'Error');
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

  onStatusUpdated(dto: UpdateTaskStatusDto): void {
    if (!this.selectedTask) return;
    this.taskService.updateStatus(this.selectedTask.id, dto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success('Status updated successfully', 'Task Management');
          this.loadMyTasks();
        } else {
          this.swal.error(res.message || 'Failed to update status', 'Task Management');
        }
      },
      error: (err) => {
        this.swal.error('An unexpected error occurred', 'Error');
      }
    });
  }

  onDeleteTask(task: TaskItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this task "${task.title}"?`,
      accept: () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.swal.success('Task deleted successfully', 'Task Management');
              this.loadMyTasks();
            } else {
              this.swal.error(res.message || 'Failed to delete task', 'Task Management');
            }
          },
          error: (err) => {
            this.swal.error('An unexpected error occurred', 'Error');
          }
        });
      }
    });
  }
}
