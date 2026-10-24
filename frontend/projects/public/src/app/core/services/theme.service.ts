import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  loadTheme(): void {
    this.http
      .get<Record<string, string>>(`${this.API_URL}/theme`)
      .pipe(catchError(() => of(null)))
      .subscribe((theme) => {
        if (theme) {
          this.applyTheme(theme);
        }
      });
  }

  private applyTheme(theme: Record<string, string>): void {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }
}
