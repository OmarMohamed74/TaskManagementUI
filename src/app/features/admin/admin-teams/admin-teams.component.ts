import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TeamService } from '../../../core/services/team.service';
import { UserService } from '../../../core/services/user.service';
import { Sweetalert } from '../../../core/services/Alerts/sweetalert';
import { Team } from '../../../core/models/team.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-teams',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CardModule,
    MessageModule,
    ToastModule,
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './admin-teams.component.html'
})
export class AdminTeamsComponent implements OnInit {
  teams: Team[] = [];
  users: User[] = [];
  loading = false;

  createTeamVisible = false;
  assignMemberVisible = false;
  selectedTeamId: number | null = null;
  totalRecords = 0;
  pageSize = 10;
  
  viewMembersVisible = false;
  selectedTeam: Team | null = null;

  createTeamForm: FormGroup;
  assignMemberForm: FormGroup;

  constructor(
    private teamService: TeamService,
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private swal: Sweetalert
  ) {
    this.createTeamForm = this.fb.group({ name: ['', Validators.required] });
    this.assignMemberForm = this.fb.group({ userId: [null, Validators.required] });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.loadUsers();
  }

  loadTeams(pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.teamService.getAllTeams(pageNumber, pageSize).subscribe({
      next: (res) => {
        const paged = res.data as any;
        this.teams = paged.items;
        this.totalRecords = paged.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(event: any): void {
    const page = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadTeams(page, this.pageSize);
  }

  viewTeamMembers(team: Team): void {
    this.selectedTeam = team;
    this.viewMembersVisible = true;
  }

  loadUsers(): void {
    this.userService.getNonPaginatedUsers().subscribe({
      next: (res) => { this.users = res.data; }
    });
  }

  openCreateTeam(): void {
    this.createTeamForm.reset();
    this.createTeamVisible = true;
  }

  submitCreateTeam(): void {
    if (this.createTeamForm.invalid) return;
    this.teamService.createTeam(this.createTeamForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success('Team created successfully', 'Team Management');
          this.createTeamVisible = false;
          this.loadTeams();
        } else {
          this.swal.error(res.message || 'Failed to create team', 'Team Management');
        }
      },
      error: (err) => {
        this.swal.error('An unexpected error occurred', 'Error');
      }
    });
  }

  openAssignMember(teamId: number): void {
    this.selectedTeamId = teamId;
    this.assignMemberForm.reset();
    this.assignMemberVisible = true;
  }

  submitAssignMember(): void {
    if (this.assignMemberForm.invalid || !this.selectedTeamId) return;
    this.teamService.assignMember(this.selectedTeamId, this.assignMemberForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success('Member assigned successfully', 'Team Management');
          this.assignMemberVisible = false;
          this.loadTeams();
        } else {
          this.swal.error(res.message || 'Failed to assign member', 'Team Management');
        }
      },
      error: (err) => {
        this.swal.error('An unexpected error occurred', 'Error');
      }
    });
  }

  get userOptions() {
    return this.users.map(u => ({ label: u.fullName || u.userName, value: u.id }));
  }
}
