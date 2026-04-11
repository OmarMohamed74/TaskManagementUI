import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
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
    TaskEditDialogComponent,
    TaskDetailDialogComponent,
    TaskStatusDialogComponent,
    InputTextModule,
    FormsModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './admin-tasks.component.html'
})
export class AdminTasksComponent implements OnInit {
  tasks: TaskItem[] = [];
  users: User[] = [];
  loading = false;
  createVisible = false;
  editVisible = false;
  detailVisible = false;
  statusVisible = false;
  selectedTask: TaskItem | null = null;
  totalRecords = 0;
  pageSize = 5;
  currentPage = 1;
  searchTerm = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private authState: AuthStateService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private swal: Sweetalert
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadTasks(pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.taskService.getAllTasks({ pageNumber, pageSize, searchTerm: this.searchTerm }).subscribe({
      next: (res) => {
        const paged = res.data as any;
        this.tasks = paged.items;
        this.totalRecords = paged.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadTasks(this.currentPage, this.pageSize);
  }

  onPageChange(event: any): void {
    this.currentPage = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadTasks(this.currentPage, this.pageSize);
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
          this.loadTasks();
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

  onEditTask(task: TaskItem): void {
    this.selectedTask = task;
    this.editVisible = true;
  }

  onStatusUpdated(): void {
    this.loadTasks();
  }

  onDeleteTask(task: TaskItem): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this task "${task.title}"?`,
      accept: () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: (res) => {
            if (res.isSuccess) {
              this.messageService.add({ severity: 'success', summary: 'Task deleted' });
              this.loadTasks();
            }
          }
        });
      }
    });
  }
}
