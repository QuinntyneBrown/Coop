// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '@api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, EntityPage, IPagableService } from '@core';

@Injectable({
  providedIn: 'root'
})
export class ConversationService implements IPagableService<Conversation> {

  uniqueIdentifierName: string = "conversationId";

  constructor(
    @Inject(baseUrl) private readonly _baseUrl: string,
    private readonly _client: HttpClient
  ) { }

  getPage(options: { pageIndex: number; pageSize: number; }): Observable<EntityPage<Conversation>> {
    return this._client.get<EntityPage<Conversation>>(`${this._baseUrl}api/conversation/page/${options.pageSize}/${options.pageIndex}`)
  }

  public get(): Observable<Conversation[]> {
    return this._client.get<{ conversations: Conversation[] }>(`${this._baseUrl}api/conversation`)
      .pipe(
        map(x => x.conversations)
      );
  }

  public getById(options: { conversationId: string }): Observable<Conversation> {
    return this._client.get<{ conversation: Conversation }>(`${this._baseUrl}api/conversation/${options.conversationId}`)
      .pipe(
        map(x => x.conversation)
      );
  }

  public remove(options: { conversation: Conversation }): Observable<void> {
    return this._client.delete<void>(`${this._baseUrl}api/conversation/${options.conversation.conversationId}`);
  }

  public create(options: { conversation: Conversation }): Observable<{ conversation: Conversation }> {
    return this._client.post<{ conversation: Conversation }>(`${this._baseUrl}api/conversation`, { conversation: options.conversation });
  }
  
  public update(options: { conversation: Conversation }): Observable<{ conversation: Conversation }> {
    return this._client.put<{ conversation: Conversation }>(`${this._baseUrl}api/conversation`, { conversation: options.conversation });
  }
}

