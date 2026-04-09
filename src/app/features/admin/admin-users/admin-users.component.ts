import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { Sweetalert } from '../../../core/services/Alerts/sweetalert';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CardModule,
    PasswordModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 10;
  createVisible = false;

  createForm: FormGroup;

  roleOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Member', value: 2 }
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private swal: Sweetalert
  ) {
    this.createForm = this.fb.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [2, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(pageNumber: number = 1, pageSize: number = 10): void {
    this.loading = true;
    this.userService.getAllUsers(pageNumber, pageSize).subscribe({
      next: (res) => {
        const paged = res.data as any;
        this.users = paged.items;
        this.totalRecords = paged.totalCount;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onPageChange(event: any): void {
    const page = (event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadUsers(page, this.pageSize);
  }

  openCreate(): void {
    this.createForm.reset({ role: 2 });
    this.createVisible = true;
  }

  submitCreate(): void {
    if (this.createForm.invalid) return;
    this.userService.createUser(this.createForm.value).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.swal.success('User created successfully', 'Management');
          this.createVisible = false;
          this.loadUsers();
        } else {
          this.swal.error(res.message || 'Failed to create user', 'Management');
        }
      },
      error: (err) => {
        this.swal.error('An unexpected error occurred', 'Error');
      }
    });
  }
}
