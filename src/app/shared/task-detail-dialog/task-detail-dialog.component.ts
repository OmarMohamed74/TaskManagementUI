import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { TaskItem } from '../../core/models/task.model';

@Component({
  selector: 'app-task-detail-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TagModule, ProgressBarModule],
  templateUrl: './task-detail-dialog.component.html'
})
export class TaskDetailDialogComponent {
  @Input() task: TaskItem | null = null;
  @Input() visible = false;

  @Output() visibleChange = new EventEmitter<boolean>();

  get progress(): number {
    if (!this.task) return 0;
    switch (this.task.status) {
      case 'Completed':  return 100;
      case 'InProgress': return 50;
      default:           return 0;
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Completed':  return 'success';
      case 'InProgress': return 'info';
      default:           return 'warn';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case 'High':   return 'danger';
      case 'Medium': return 'warn';
      case 'Low':    return 'success';
      default:       return 'secondary';
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }
}
