import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskItem, CreateTaskDto, UpdateTaskStatusDto, PagedResult, TaskQuery } from '../models/task.model';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  createTask(dto: CreateTaskDto): Observable<ApiResponse<TaskItem>> {
    return this.http.post<ApiResponse<TaskItem>>(this.baseUrl, dto);
  }

  getMyTasks(query: TaskQuery): Observable<ApiResponse<PagedResult<TaskItem>>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());
    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    return this.http.get<ApiResponse<PagedResult<TaskItem>>>(`${this.baseUrl}/my`, { params });
  }

  getAllTasks(query: TaskQuery): Observable<ApiResponse<PagedResult<TaskItem>>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    return this.http.get<ApiResponse<PagedResult<TaskItem>>>(`${this.baseUrl}/all`, { params });
  }

  getTeamTasks(teamId: number, query: TaskQuery): Observable<ApiResponse<PagedResult<TaskItem>>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());
    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    return this.http.get<ApiResponse<PagedResult<TaskItem>>>(`${this.baseUrl}/team/${teamId}`, { params });
  }

  getTaskById(id: number): Observable<ApiResponse<TaskItem>> {
    return this.http.get<ApiResponse<TaskItem>>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: number, dto: UpdateTaskStatusDto): Observable<ApiResponse<TaskItem>> {
    return this.http.put<ApiResponse<TaskItem>>(`${this.baseUrl}/${id}/status`, dto);
  }

  deleteTask(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
