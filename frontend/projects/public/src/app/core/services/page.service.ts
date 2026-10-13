import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import type { WebsitePage } from '../models/website-page';

/** Read access to the website pages the office manages (anonymous endpoints). */
@Injectable({ providedIn: 'root' })
export class PageService {
  private readonly api = inject(ApiService);

  getAll(): Observable<WebsitePage[]> {
    return this.api
      .get<{ pages?: WebsitePage[] }>('pages')
      .pipe(map((response) => response?.pages ?? []));
  }

  getBySlug(slug: string): Observable<WebsitePage> {
    return this.api
      .get<{ page: WebsitePage }>(`pages/${encodeURIComponent(slug)}`)
      .pipe(map((response) => response.page));
  }
}
