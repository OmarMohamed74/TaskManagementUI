import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { CurrentUser } from '../models/auth.model';

interface JwtPayload {
  sub: string;         // userId
  unique_name: string; // userName
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string; // role
  teamId: string;
  fullName: string;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly TOKEN_KEY = 'tm_token';
  private readonly USER_KEY = 'tm_user';

  private router = inject(Router);
  private cookieService = inject(CookieService);

  currentUser = signal<CurrentUser | null>(this.loadUser());

  constructor() { }

  setUser(token: string): void {
    const user = this.extractUserFromToken(token);
    if (!user) return;

    this.cookieService.set(this.TOKEN_KEY, token, 1, '/', '', true, 'Lax');
    this.cookieService.set(this.USER_KEY, JSON.stringify(user), 1, '/', '', true, 'Lax');

    this.currentUser.set(user);
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
    this.cookieService.delete(this.USER_KEY, '/');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = this.cookieService.get(this.TOKEN_KEY);
    return token ? token : null;
  }

  isLoggedIn(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'Admin';
  }

  isMember(): boolean {
    return this.currentUser()?.role === 'Member';
  }

  private loadUser(): CurrentUser | null {
    const json = this.cookieService.get(this.USER_KEY);
    return json ? JSON.parse(json) : null;
  }

  private extractUserFromToken(token: string): CurrentUser | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        token: token,
        userId: parseInt(decoded.sub),
        userName: decoded.unique_name,
        role: (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || (decoded as any).role) as 'Admin' | 'Member',
        teamId: decoded.teamId ? parseInt(decoded.teamId) : undefined,
        fullName: decoded.fullName
      };
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
