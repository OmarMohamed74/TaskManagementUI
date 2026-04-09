export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface CurrentUser {
  token: string;
  userName: string;
  role: 'Admin' | 'Member';
  userId: number;
  teamId?: number;
  fullName: string;
}
