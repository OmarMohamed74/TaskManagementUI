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

@Component({
  selector: 'app-admin-tasks',
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
    TaskStatusDialogComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-tasks.component.html'
})
export class AdminTasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  users: User[] = [];
  loading = false;
  createVisible = false;
  detailVisible = false;
  statusVisible = false;
  selectedTask: TaskItem | null = null;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authState: AuthStateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private swal: Sweetalert
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadMyTasks();
  }

  loadMyTasks(pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.taskService.getMyTasks(pageNumber, pageSize).subscribe({
      next: (res) => {
        const paged = res.data as any;
        this.tasks = paged.items;
        this.totalRecords = paged.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadMyTasks(this.currentPage, this.pageSize);
  }

  loadUsers(): void {
    this.userService.getNonPaginatedUsers().subscribe({
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
          this.messageService.add({ severity: 'success', summary: 'Status updated' });
          this.loadMyTasks();
        }
      }
    });
  }

  onDeleteTask(task: TaskItem): void {
    this.confirmationService.confirm({
      message: `Delete task "${task.title}"?`,
      accept: () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.messageService.add({ severity: 'success', summary: 'Task deleted' });
              this.loadMyTasks();
            }
          }
        });
      }
    });
  }
}
