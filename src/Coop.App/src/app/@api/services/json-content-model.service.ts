import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonContentModel } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class JsonContentModelService implements IPagableService<JsonContentModel> {

  uniqueIdentifierName: string = "jsonContentModelId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<JsonContentModel>> {
    return this._client.get<EntityPage<JsonContentModel>>(`${this._baseUrl}api/jsonContentModel/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<JsonContentModel[]> {
    return this._client.get<{ jsonContentModels: JsonContentModel[] }>(`${this._baseUrl}api/jsonContentModel`)
      .pipe(
        map(x => x.jsonContentModels)
      );
  }

  public getById(options: { jsonContentModelId: string }): Observable<JsonContentModel> {
    return this._client.get<{ jsonContentModel: JsonContentModel }>(`${this._baseUrl}api/jsonContentModel/${options.jsonContentModelId}`)
      .pipe(
        map(x => x.jsonContentModel)
      );
  }

  public remove(options: { jsonContentModel: JsonContentModel }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/jsonContentModel/${options.jsonContentModel.jsonContentModelId}`);
  }

  public create(options: { jsonContentModel: JsonContentModel }): Observable<{ jsonContentModel: JsonContentModel }> {
    return this._client.post<{ jsonContentModel: JsonContentModel }>(`${this._baseUrl}api/jsonContentModel`, { jsonContentModel: options.jsonContentModel });
  }
  
  public update(options: { jsonContentModel: JsonContentModel }): Observable<{ jsonContentModel: JsonContentModel }> {
    return this._client.put<{ jsonContentModel: JsonContentModel }>(`${this._baseUrl}api/jsonContentModel`, { jsonContentModel: options.jsonContentModel });
  }
}
