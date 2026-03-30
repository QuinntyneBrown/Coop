import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, catchError, of } from 'rxjs';

export interface JsonContent {
  id: string;
  name: string;
  content: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class JsonContentService {
  private api = inject(ApiService);

  getByName(name: string): Observable<JsonContent | null> {
    return this.api.get<JsonContent>(`json-content/${name}`).pipe(
      catchError(() => of(null)),
    );
  }

  getAll(): Observable<JsonContent[]> {
    return this.api.get<JsonContent[]>('json-content');
  }
}
