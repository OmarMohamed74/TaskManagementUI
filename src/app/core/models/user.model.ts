export interface User {
  id: number;
  fullName: string;
  userName: string;
  role: string;
  teamId?: number;
}

export interface CreateUserDto {
  fullName: string;
  userName: string;
  password: string;
  role: number;
}
