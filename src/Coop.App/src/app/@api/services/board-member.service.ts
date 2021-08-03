import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BoardMember } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class BoardMemberService implements IPagableService<BoardMember> {

  uniqueIdentifierName: string = "boardMemberId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<BoardMember>> {
    return this._client.get<EntityPage<BoardMember>>(`${this._baseUrl}api/boardMember/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<BoardMember[]> {
    return this._client.get<{ boardMembers: BoardMember[] }>(`${this._baseUrl}api/boardMember`)
      .pipe(
        map(x => x.boardMembers)
      );
  }

  public getById(options: { boardMemberId: string }): Observable<BoardMember> {
    return this._client.get<{ boardMember: BoardMember }>(`${this._baseUrl}api/boardMember/${options.boardMemberId}`)
      .pipe(
        map(x => x.boardMember)
      );
  }

  public remove(options: { boardMember: BoardMember }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/boardMember/${options.boardMember.boardMemberId}`);
  }

  public create(options: { boardMember: BoardMember }): Observable<{ boardMember: BoardMember }> {
    return this._client.post<{ boardMember: BoardMember }>(`${this._baseUrl}api/boardMember`, { boardMember: options.boardMember });
  }
  
  public update(options: { boardMember: BoardMember }): Observable<{ boardMember: BoardMember }> {
    return this._client.put<{ boardMember: BoardMember }>(`${this._baseUrl}api/boardMember`, { boardMember: options.boardMember });
  }
}
