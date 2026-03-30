import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, catchError, of, map } from 'rxjs';

export interface JsonContent {
  id: string;
  name: string;
  content: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class JsonContentService {
  private api = inject(ApiService);

  getByName(name: string): Observable<JsonContent | null> {
    // Try the BFF endpoint first, then fall back to the direct API
    return this.api.get<any>(`json-content/${name}`).pipe(
      map((resp: any) => {
        // Handle both wrapped {jsonContent: ...} and direct response
        if (resp && resp.jsonContent !== undefined) return resp.jsonContent;
        return resp;
      }),
      catchError(() => this.api.get<any>(`jsoncontent/name/${name}`).pipe(
        map((resp: any) => resp?.jsonContent ?? resp),
        catchError(() => of(null)),
      )),
    );
  }

  getAll(): Observable<JsonContent[]> {
    return this.api.get<any>('json-content').pipe(
      map((resp: any) => {
        if (Array.isArray(resp)) return resp;
        if (resp?.jsonContents) return resp.jsonContents;
        return [];
      }),
      catchError(() => of([])),
    );
  }
}
