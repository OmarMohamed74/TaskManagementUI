import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, CreateUserDto } from '../models/user.model';
import { PagedResult } from '../models/task.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './task.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  createUser(dto: CreateUserDto): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.baseUrl, dto);
  }

  getAllUsers(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<User>>> {
    return this.http.get<ApiResponse<PagedResult<User>>>(`${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getNonPaginatedUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/all`);
  }

  getTeamMembers(teamId: number): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/team/${teamId}`);
  }

  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }
}
