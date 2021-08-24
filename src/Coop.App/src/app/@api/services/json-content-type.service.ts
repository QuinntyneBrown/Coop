import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonContentType } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class JsonContentTypeService implements IPagableService<JsonContentType> {

  uniqueIdentifierName: string = "jsonContentTypeId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<JsonContentType>> {
    return this._client.get<EntityPage<JsonContentType>>(`${this._baseUrl}api/jsonContentType/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<JsonContentType[]> {
    return this._client.get<{ jsonContentTypes: JsonContentType[] }>(`${this._baseUrl}api/jsonContentType`)
      .pipe(
        map(x => x.jsonContentTypes)
      );
  }

  public getById(options: { jsonContentTypeId: string }): Observable<JsonContentType> {
    return this._client.get<{ jsonContentType: JsonContentType }>(`${this._baseUrl}api/jsonContentType/${options.jsonContentTypeId}`)
      .pipe(
        map(x => x.jsonContentType)
      );
  }

  public getByName(options: { name: string }): Observable<JsonContentType> {
    return this._client.get<{ jsonContentType: JsonContentType }>(`${this._baseUrl}api/jsonContentType/name/${options.name}`)
      .pipe(
        map(x => x.jsonContentType)
      );
  }

  public remove(options: { jsonContentType: JsonContentType }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/jsonContentType/${options.jsonContentType.jsonContentTypeId}`);
  }

  public create(options: { jsonContentType: JsonContentType }): Observable<{ jsonContentType: JsonContentType }> {
    return this._client.post<{ jsonContentType: JsonContentType }>(`${this._baseUrl}api/jsonContentType`, { jsonContentType: options.jsonContentType });
  }

  public update(options: { jsonContentType: JsonContentType }): Observable<{ jsonContentType: JsonContentType }> {
    return this._client.put<{ jsonContentType: JsonContentType }>(`${this._baseUrl}api/jsonContentType`, { jsonContentType: options.jsonContentType });
  }
}
