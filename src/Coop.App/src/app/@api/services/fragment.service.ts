import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Fragment } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class FragmentService implements IPagableService<Fragment> {

  uniqueIdentifierName: string = "fragmentId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Fragment>> {
    return this._client.get<EntityPage<Fragment>>(`${this._baseUrl}api/fragment/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Fragment[]> {
    return this._client.get<{ fragments: Fragment[] }>(`${this._baseUrl}api/fragment`)
      .pipe(
        map(x => x.fragments)
      );
  }

  public getById(options: { fragmentId: string }): Observable<Fragment> {
    return this._client.get<{ fragment: Fragment }>(`${this._baseUrl}api/fragment/${options.fragmentId}`)
      .pipe(
        map(x => x.fragment)
      );
  }

  public remove(options: { fragment: Fragment }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/fragment/${options.fragment.fragmentId}`);
  }

  public create(options: { fragment: Fragment }): Observable<{ fragment: Fragment }> {
    return this._client.post<{ fragment: Fragment }>(`${this._baseUrl}api/fragment`, { fragment: options.fragment });
  }
  
  public update(options: { fragment: Fragment }): Observable<{ fragment: Fragment }> {
    return this._client.put<{ fragment: Fragment }>(`${this._baseUrl}api/fragment`, { fragment: options.fragment });
  }
}
