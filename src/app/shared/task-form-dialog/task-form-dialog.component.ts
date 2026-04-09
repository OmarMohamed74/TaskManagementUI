import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CreateTaskDto } from '../../core/models/task.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-task-form-dialog',
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
  templateUrl: './task-form-dialog.component.html'
})
export class TaskFormDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() users: User[] = [];
  @Input() teamId?: number;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() taskCreated = new EventEmitter<CreateTaskDto>();

  form: FormGroup;

  priorityOptions = [
    { label: 'Low', value: 0 },
    { label: 'Medium', value: 1 },
    { label: 'High', value: 2 }
  ];

  minDate: Date = new Date();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: [1, Validators.required],
      assigneeId: [null, Validators.required],
      dueDate: [null, Validators.required]
    });
  }

  ngOnInit(): void { }

  get userOptions() {
    return this.users.map(u => ({ label: u.fullName || u.userName, value: u.id }));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const dto: CreateTaskDto = {
      ...this.form.value,
      teamId: this.teamId
    };
    this.taskCreated.emit(dto);
    this.close();
  }

  close(): void {
    this.form.reset({ priority: 'Medium' });
    this.visibleChange.emit(false);
  }
}
