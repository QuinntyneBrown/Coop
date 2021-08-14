import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CssCustomProperty } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class CssCustomPropertyService implements IPagableService<CssCustomProperty> {

  uniqueIdentifierName: string = "cssCustomPropertyId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<CssCustomProperty>> {
    return this._client.get<EntityPage<CssCustomProperty>>(`${this._baseUrl}api/cssCustomProperty/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<CssCustomProperty[]> {
    return this._client.get<{ cssCustomProperties: CssCustomProperty[] }>(`${this._baseUrl}api/cssCustomProperty`)
      .pipe(
        map(x => x.cssCustomProperties)
      );
  }

  public getById(options: { cssCustomPropertyId: string }): Observable<CssCustomProperty> {
    return this._client.get<{ cssCustomProperty: CssCustomProperty }>(`${this._baseUrl}api/cssCustomProperty/${options.cssCustomPropertyId}`)
      .pipe(
        map(x => x.cssCustomProperty)
      );
  }

  public remove(options: { cssCustomProperty: CssCustomProperty }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/cssCustomProperty/${options.cssCustomProperty.cssCustomPropertyId}`);
  }

  public create(options: { cssCustomProperty: CssCustomProperty }): Observable<{ cssCustomProperty: CssCustomProperty }> {
    return this._client.post<{ cssCustomProperty: CssCustomProperty }>(`${this._baseUrl}api/cssCustomProperty`, { cssCustomProperty: options.cssCustomProperty });
  }
  
  public update(options: { cssCustomProperty: CssCustomProperty }): Observable<{ cssCustomProperty: CssCustomProperty }> {
    return this._client.put<{ cssCustomProperty: CssCustomProperty }>(`${this._baseUrl}api/cssCustomProperty`, { cssCustomProperty: options.cssCustomProperty });
  }
}
