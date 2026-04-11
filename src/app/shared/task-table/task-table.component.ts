import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { TaskItem } from '../../core/models/task.model';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, InputTextModule, FormsModule, InputGroupModule, InputGroupAddonModule, TooltipModule],
  templateUrl: './task-table.component.html'
})
export class TaskTableComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() loading = false;
  @Input() canEdit = true;
  @Input() canDelete = true;
  @Input() totalRecords = 0;
  @Input() rows = 5;

  @Output() viewTask = new EventEmitter<TaskItem>();
  @Output() editStatus = new EventEmitter<TaskItem>();
  @Output() editTask = new EventEmitter<TaskItem>();
  @Output() deleteTask = new EventEmitter<TaskItem>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchTerm: string = '';

  onSearch() {
    this.search.emit(this.searchTerm);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'Completed': return 'success';
      case 'InProgress': return 'info';
      case 'Todo': return 'warn';
      default: return 'secondary';
    }
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warn';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  }
}
