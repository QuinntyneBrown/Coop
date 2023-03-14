// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements IPagableService<Message> {

  uniqueIdentifierName: string = "messageId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Message>> {
    return this._client.get<EntityPage<Message>>(`${this._baseUrl}api/message/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Message[]> {
    return this._client.get<{ messages: Message[] }>(`${this._baseUrl}api/message`)
      .pipe(
        map(x => x.messages)
      );
  }

  public getMy(): Observable<Message[]> {
    return this._client.get<{ messages: Message[] }>(`${this._baseUrl}api/message/my`)
      .pipe(
        map(x => x.messages)
      );
  }

  public getById(options: { messageId: string }): Observable<Message> {
    return this._client.get<{ message: Message }>(`${this._baseUrl}api/message/${options.messageId}`)
      .pipe(
        map(x => x.message)
      );
  }

  public remove(options: { message: Message }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/message/${options.message.messageId}`);
  }

  public create(options: { message: Message }): Observable<{ message: Message }> {
    return this._client.post<{ message: Message }>(`${this._baseUrl}api/message`, { message: options.message });
  }

  public createSupport(options: { message: Partial<Message> }): Observable<{ message: Message }> {
    return this._client.post<{ message: Message }>(`${this._baseUrl}api/message/support`, { message: options.message });
  }
  public update(options: { message: Message }): Observable<{ message: Message }> {
    return this._client.put<{ message: Message }>(`${this._baseUrl}api/message`, { message: options.message });
  }
}

