import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

export interface AuthTokenResponse {
  token: string;
  refreshToken: string;
  userId: string;
  username: string;
  roles: string[];
}

export interface AuthUser {
  token: string;
  userId: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUser$ = new BehaviorSubject<AuthUser | null>(this.loadUser());

  get user$(): Observable<AuthUser | null> {
    return this.currentUser$.asObservable();
  }

  get currentUser(): AuthUser | null {
    return this.currentUser$.value;
  }

  get isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  login(username: string, password: string): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.API_URL}/user/token`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user_id', response.userId);
        localStorage.setItem('auth_username', response.username);
        this.currentUser$.next({
          token: response.token,
          userId: response.userId,
          username: response.username,
        });
      }),
    );
  }

  register(data: { invitationToken: string; username: string; password: string }): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.API_URL}/user/register`, data).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user_id', response.userId);
        localStorage.setItem('auth_username', response.username);
        this.currentUser$.next({
          token: response.token,
          userId: response.userId,
          username: response.username,
        });
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('auth_username');
    this.currentUser$.next(null);
    this.router.navigate(['/login']);
  }

  private loadUser(): AuthUser | null {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('auth_user_id');
    const username = localStorage.getItem('auth_username');
    if (token && userId && username) {
      return { token, userId, username };
    }
    return null;
  }
}
