import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import type { Director } from '../models/director';

/** The Board of Directors list the home page shows (`/api/board-of-directors`, L2-REQ-085). */
@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly api = inject(ApiService);

  getAll(): Observable<Director[]> {
    return this.api
      .get<{ directors?: Director[] }>('/board-of-directors')
      .pipe(map((response) => response?.directors ?? []));
  }

  /** Replaces the whole list, in order. */
  save(directors: Director[]): Observable<Director[]> {
    return this.api
      .put<{ directors?: Director[] }>('/board-of-directors', { directors })
      .pipe(map((response) => response?.directors ?? directors));
  }
}
