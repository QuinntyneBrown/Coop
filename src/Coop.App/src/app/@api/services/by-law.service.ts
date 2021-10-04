import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ByLaw } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class ByLawService implements IPagableService<ByLaw> {

  uniqueIdentifierName: string = "byLawId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<ByLaw>> {
    return this._client.get<EntityPage<ByLaw>>(`${this._baseUrl}api/byLaw/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<ByLaw[]> {
    return this._client.get<{ byLaws: ByLaw[] }>(`${this._baseUrl}api/byLaw`)
      .pipe(
        map(x => x.byLaws)
      );
  }

  public getPublished(): Observable<ByLaw[]> {
    return this._client.get<{ byLaws: ByLaw[] }>(`${this._baseUrl}api/byLaw/published`)
      .pipe(
        map(x => x.byLaws)
      );
  }

  public getById(options: { byLawId: string }): Observable<ByLaw> {
    return this._client.get<{ byLaw: ByLaw }>(`${this._baseUrl}api/byLaw/${options.byLawId}`)
      .pipe(
        map(x => x.byLaw)
      );
  }

  public remove(options: { byLaw: ByLaw }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/byLaw/${options.byLaw.byLawId}`);
  }

  public create(options: any): Observable<{ byLaw: ByLaw }> {
    return this._client.post<{ byLaw: ByLaw }>(`${this._baseUrl}api/byLaw`, options);
  }

  public update(options: { byLaw: ByLaw }): Observable<{ byLaw: ByLaw }> {
    return this._client.put<{ byLaw: ByLaw }>(`${this._baseUrl}api/byLaw`, { byLaw: options.byLaw });
  }
}
