import { Injectable } from "@angular/core";
import { Conversation, ConversationService } from "@api";
import { switchMapByKey } from "@core/abstractions/switch-map-by-key";
import { ComponentStore } from "@ngrx/component-store";
import { EMPTY, of } from "rxjs";
import { catchError, first, mergeMap, shareReplay, switchMap, tap } from "rxjs/operators";

export interface ConversationStoreState {
  conversations?: Conversation[],
  conversation?: Conversation
}

@Injectable({
  providedIn: "root"
})
export class ConversationStore extends ComponentStore<ConversationStoreState> {

  constructor(
    private readonly _conversationService: ConversationService
  ) {
    super({ })
  }

  public getConversations() {
    return of(undefined)
    .pipe(
      tap(_ => this._getConversations()),
      switchMap(_ => this.select(x => x.conversations))
    )
  }

  public getConversationById(conversationId: string) {
    return of(undefined)
    .pipe(
      tap(_ => this._getConversationById(conversationId)),
      switchMap(_ => this.select(x => x.conversation))
    );
  }

  private readonly _getConversations = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(_ => this.select(x => x.conversations).pipe(first())
      .pipe(
        switchMap(conversations => {
          if(conversations === undefined) {
            return this._conversationService.get()
            .pipe(
              tap(conversations => this.setState((state) => ({...state, conversations }))),
            );
          }
          return of(conversations);
        }),
      )),
      shareReplay(1)
    ));

  private _getConversationById = this.effect<string>(conversationId$ =>
    conversationId$.pipe(
      switchMapByKey(conversationId => conversationId, conversationId => {
        return this.select(x => x.conversation).pipe(first())
        .pipe(
          switchMap(conversation => {
            if(conversation?.conversationId == conversationId) {
              return of(conversation);
            }
            return this._conversationService.getById({ conversationId })
            .pipe(
              tap((conversation:Conversation) => this.setState((state) => ({ ...state, conversation })))
            )
          }),
        );
      }),
      shareReplay(1)
    ))

  readonly createConversation = this.effect<Conversation>(conversation$ => conversation$.pipe(
    mergeMap(conversation => {
      return this._conversationService.create({ conversation })
      .pipe(
        tap({
          next:({ conversation }) => {
            this.setState((state) => ({...state, conversation }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly updateConversation = this.effect<Conversation>(conversation$ => conversation$.pipe(
    mergeMap(conversation => {
      return this._conversationService.create({ conversation })
      .pipe(
        tap({
          next: ({ conversation }) => {
            this.setState((state) => ({...state, conversation }))
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));

  readonly removeConversation = this.effect<Conversation>(conversation$ => conversation$.pipe(
    mergeMap(conversation => {
      return this._conversationService.remove({ conversation })
      .pipe(
        tap({
          next: _ => {
            this.setState((state) => ({...state, conversation: null }));
          },
          error: () => {

          }
        }),
        catchError(() => EMPTY)
      )
    })
  ));
}
