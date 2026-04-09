import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team, CreateTeamDto, AssignMemberDto } from '../models/team.model';
import { PagedResult } from '../models/task.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './task.service';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly baseUrl = `${environment.apiUrl}/api/teams`;

  constructor(private http: HttpClient) {}

  createTeam(dto: CreateTeamDto): Observable<ApiResponse<Team>> {
    return this.http.post<ApiResponse<Team>>(this.baseUrl, dto);
  }

  getAllTeams(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<PagedResult<Team>>> {
    return this.http.get<ApiResponse<PagedResult<Team>>>(`${this.baseUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

  getTeamById(id: number): Observable<ApiResponse<Team>> {
    return this.http.get<ApiResponse<Team>>(`${this.baseUrl}/${id}`);
  }

  assignMember(teamId: number, dto: AssignMemberDto): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${teamId}/assign`, dto);
  }
}
