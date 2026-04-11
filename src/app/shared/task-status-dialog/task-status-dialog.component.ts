import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TaskItem, UpdateTaskStatusDto } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';
import { Sweetalert } from '../../core/services/Alerts/sweetalert';

@Component({
  selector: 'app-task-status-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, SelectModule],
  templateUrl: './task-status-dialog.component.html'
})
export class TaskStatusDialogComponent implements OnChanges {
  @Input() task: TaskItem | null = null;
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() statusUpdated = new EventEmitter<void>();

  form: FormGroup;

  statusOptions = [
    { label: 'Todo', value: 0 },
    { label: 'In Progress', value: 1 },
    { label: 'Completed', value: 2 }
  ];

  loading = false;

  constructor(private fb: FormBuilder, private taskService: TaskService, private swal: Sweetalert) {
    this.form = this.fb.group({ status: [0, Validators.required] });
  }

  ngOnChanges(): void {
    if (this.task) {
      this.form.patchValue({ status: this.task.status });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.task) return;

    this.loading = true;
    const dto: UpdateTaskStatusDto = this.form.value;
    this.taskService.updateStatus(this.task.id, dto).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.isSuccess) {
          this.swal.success(res.message || 'Status updated successfully', 'Status Update');
          this.statusUpdated.emit();
          this.close();
        } else {
          this.swal.error(res.message || 'Failed to update status', 'Status Update');
        }
      },
      error: (err) => {
        this.loading = false;
        this.swal.error(err?.error?.message || err.message || 'An unexpected error occurred', 'Error');
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
  }
}

