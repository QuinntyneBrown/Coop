import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notice } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class NoticeService implements IPagableService<Notice> {

  uniqueIdentifierName: string = "noticeId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Notice>> {
    return this._client.get<EntityPage<Notice>>(`${this._baseUrl}api/notice/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Notice[]> {
    return this._client.get<{ notices: Notice[] }>(`${this._baseUrl}api/notice`)
      .pipe(
        map(x => x.notices)
      );
  }

  public getPublished(): Observable<Notice[]> {
    return this._client.get<{ notices: Notice[] }>(`${this._baseUrl}api/notice/published`)
      .pipe(
        map(x => x.notices)
      );
  }

  public getById(options: { noticeId: string }): Observable<Notice> {
    return this._client.get<{ notice: Notice }>(`${this._baseUrl}api/notice/${options.noticeId}`)
      .pipe(
        map(x => x.notice)
      );
  }

  public remove(options: { notice: Notice }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/notice/${options.notice.noticeId}`);
  }

  public create(options: { notice: Notice }): Observable<{ notice: Notice }> {
    return this._client.post<{ notice: Notice }>(`${this._baseUrl}api/notice`, { notice: options.notice });
  }

  public update(options: { notice: Notice }): Observable<{ notice: Notice }> {
    return this._client.put<{ notice: Notice }>(`${this._baseUrl}api/notice`, { notice: options.notice });
  }
}
