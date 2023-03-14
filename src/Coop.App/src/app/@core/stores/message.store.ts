// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from "@angular/core";
import { Message, MessageService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface MessageStoreState {
  messages?: Message[],
  message?: Message
}

@Injectable({
  providedIn: "root"
})
export class MessageStore extends ComponentStore<MessageStoreState> {

  constructor(
    private readonly _messageService: MessageService
  ) {
    super({ })
  }

  public getMessages() {
    return of(undefined)
    .pipe(
      tap(_ => this._getMessages()),
      switchMap(_ => this.select(x => x.messages))
    )
  }

  public getMessageById(messageId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getMessageById(messageId)),
      switchMap(_ => this.select(x => x.message))
    );
  }

  private readonly _getMessages = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.messages).pipe(first())
      .pipe(
        switchMap(messages => {
          if(messages === undefined) {
            return this._messageService.get()
            .pipe(
              tap(messages => this.setState((state) => ({...state, messages }))),
            );
          }
          return of(messages);
        }),
      )),
      shareReplay(1)
    ));

  private _getMessageById = this.effect<string>(messageId$ =>
    messageId$.pipe(
      switchMapByKey(messageId => messageId, messageId => {
        return this.select(x => x.message).pipe(first())
        .pipe(
          switchMap(message => {
            if(message?.messageId == messageId) {
              return of(message);
            }
            return this._messageService.getById({ messageId })
            .pipe(
              tap((message:Message) => this.setState((state) => ({ ...state, message })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createMessage = this.effect<Message>(message$ => message$.pipe(
    mergeMap(message => {
      return this._messageService.create({ message })
      .pipe(
        tap({
          next:({ message }) => {
            this.setState((state) => ({...state, message }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateMessage = this.effect<Message>(message$ => message$.pipe(
    mergeMap(message => {
      return this._messageService.create({ message })
      .pipe(
        tap({
          next: ({ message }) => {
            this.setState((state) => ({...state, message }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeMessage = this.effect<Message>(message$ => message$.pipe(
    mergeMap(message => {
      return this._messageService.remove({ message })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, message: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}

