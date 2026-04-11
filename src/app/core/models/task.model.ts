export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: number;
  assignedToName?: string;
  createdById: number;
  createdByName?: string;
  teamId?: number;
  dueDate?: string;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: number;
  teamId?: number;
  dueDate: string;
}

export interface UpdateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId: number;
  dueDate: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface TaskQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
}
