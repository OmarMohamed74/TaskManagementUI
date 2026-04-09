export type TaskStatus = 'Todo' | 'InProgress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedToId?: number;
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
  priority: number;
  assignedToId?: number;
  teamId?: number;
  dueDate?: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
