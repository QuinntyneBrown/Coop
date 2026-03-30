import { Injectable } from '@angular/core';
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

export interface CurrentUser {
  userId: string;
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:5000/api';
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem('auth_token');
    const userId = localStorage.getItem('auth_user_id');
    const username = localStorage.getItem('auth_username');
    if (token && userId && username) {
      this.currentUserSubject.next({ userId, username, roles: [] });
    }
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.API_URL}/user/token`, { username, password }).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user_id', response.userId);
        localStorage.setItem('auth_username', response.username);
        this.currentUserSubject.next({
          userId: response.userId,
          username: response.username,
          roles: response.roles || []
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user_id');
    localStorage.removeItem('auth_username');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(data: { username: string; password: string; invitationToken: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/user`, data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.API_URL}/user/password`, { currentPassword, newPassword });
  }

  getCurrentUserFromApi(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/current`).pipe(
      catchError(() => of(null))
    );
  }
}
