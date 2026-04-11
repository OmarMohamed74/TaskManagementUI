import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TaskItem, UpdateTaskDto } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { TaskService } from '../../core/services/task.service';
import { Sweetalert } from '../../core/services/Alerts/sweetalert';

@Component({
  selector: 'app-task-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './task-edit-dialog.component.html'
})
export class TaskEditDialogComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() task?: TaskItem;
  @Input() users: User[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() taskSaved = new EventEmitter<void>();

  form: FormGroup;

  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];

  minDate: Date = new Date();
  isLoadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authState: AuthStateService,
    private taskService: TaskService,
    private swal: Sweetalert
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['Medium', Validators.required],
      assigneeId: [null, Validators.required],
      dueDate: [null, Validators.required]
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        priority: this.task.priority,
        assigneeId: this.task.assigneeId,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null
      });

      this.loadRelevantUsers();
    }
  }

  private loadRelevantUsers(): void {
    if (!this.task) return;

    this.isLoadingUsers = true;
    const userRequest = this.authState.isAdmin()
      ? this.userService.getNonPaginatedUsers()
      : this.userService.getTeamMembers(this.authState.currentUser()?.teamId || this.task.teamId || 0);

    userRequest.subscribe({
      next: (res) => {
        this.users = res.data;
        this.isLoadingUsers = false;
        // Ensure the current assignee is still selected after the list loads
        this.form.patchValue({ assigneeId: this.task?.assigneeId });
      },
      error: () => {
        this.isLoadingUsers = false;
      }
    });
  }

  get userOptions() {
    return this.users.map(u => ({ label: u.fullName || u.userName, value: u.id }));
  }

  onSubmit(): void {
    if (this.form.invalid || !this.task) return;

    const dto: UpdateTaskDto = {
      title: this.form.value.title,
      description: this.form.value.description,
      priority: this.form.value.priority,
      assigneeId: this.form.value.assigneeId,
      dueDate: this.form.value.dueDate ? new Date(this.form.value.dueDate).toISOString() : new Date().toISOString()
    };

    this.taskService.updateTask(this.task.id, dto).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success(res.message || 'Task updated successfully', 'Task Management');
          this.taskSaved.emit();
          this.close();
        } else {
          this.swal.error(res.message || 'Failed to update task', 'Task Management');
        }
      },
      error: (err) => {
        this.swal.error(err?.error?.message || err.message || 'An unexpected error occurred', 'Error');
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
  }
}
