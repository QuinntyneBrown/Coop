import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileCssCustomProperty } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';
import { CssCustomProperty } from '@api/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileCssCustomPropertyService implements IPagableService<ProfileCssCustomProperty> {

  uniqueIdentifierName: string = "profileCssCustomPropertyId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<ProfileCssCustomProperty>> {
    return this._client.get<EntityPage<ProfileCssCustomProperty>>(`${this._baseUrl}api/profileCssCustomProperty/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<ProfileCssCustomProperty[]> {
    return this._client.get<{ profileCssCustomProperties: ProfileCssCustomProperty[] }>(`${this._baseUrl}api/profileCssCustomProperty`)
      .pipe(
        map(x => x.profileCssCustomProperties)
      );
  }

  public getCurrent(): Observable<CssCustomProperty[]> {
    return this._client.get<{ profileCssCustomProperties: CssCustomProperty[] }>(`${this._baseUrl}api/profileCssCustomProperty/current`)
      .pipe(
        map(x => x.profileCssCustomProperties)
      );
  }

  public getById(options: { profileCssCustomPropertyId: string }): Observable<ProfileCssCustomProperty> {
    return this._client.get<{ profileCssCustomProperty: ProfileCssCustomProperty }>(`${this._baseUrl}api/profileCssCustomProperty/${options.profileCssCustomPropertyId}`)
      .pipe(
        map(x => x.profileCssCustomProperty)
      );
  }

  public remove(options: { profileCssCustomProperty: ProfileCssCustomProperty }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/profileCssCustomProperty/${options.profileCssCustomProperty.profileCssCustomPropertyId}`);
  }

  public create(options: { profileCssCustomProperty: ProfileCssCustomProperty }): Observable<{ profileCssCustomProperty: ProfileCssCustomProperty }> {
    return this._client.post<{ profileCssCustomProperty: ProfileCssCustomProperty }>(`${this._baseUrl}api/profileCssCustomProperty`, { profileCssCustomProperty: options.profileCssCustomProperty });
  }

  public update(options: { profileCssCustomProperty: ProfileCssCustomProperty }): Observable<{ profileCssCustomProperty: ProfileCssCustomProperty }> {
    return this._client.put<{ profileCssCustomProperty: ProfileCssCustomProperty }>(`${this._baseUrl}api/profileCssCustomProperty`, { profileCssCustomProperty: options.profileCssCustomProperty });
  }
}
