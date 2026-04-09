import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TaskItem, UpdateTaskStatusDto } from '../../core/models/task.model';

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
  @Output() statusUpdated = new EventEmitter<UpdateTaskStatusDto>();

  form: FormGroup;

  statusOptions = [
    { label: 'Todo', value: 0 },
    { label: 'In Progress', value: 1 },
    { label: 'Completed', value: 2 }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({ status: [0, Validators.required] });
  }

  ngOnChanges(): void {
    if (this.task) {
      this.form.patchValue({ status: this.task.status });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.statusUpdated.emit(this.form.value);
    this.close();
  }

  close(): void {
    this.visibleChange.emit(false);
  }
}
