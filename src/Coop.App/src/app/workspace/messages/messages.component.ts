
import { Component, OnDestroy } from '@angular/core';
import { Message, MessageService } from '@api';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnDestroy {

  private readonly _destroyed$: Subject<void> = new Subject();

  private readonly _refresh$: BehaviorSubject<void> = new BehaviorSubject(null);

  public vm$ = this._refresh$
  .pipe(
    takeUntil(this._destroyed$),
    switchMap(_ => this._messageService.getMy()),
    map(messages => {

      return {
        messages
      };
    })
  );

  constructor(
    private readonly _messageService: MessageService
  ) {

  }

  handleSend(body: string) {
    let message = { body } as Partial<Message>;

    this._messageService.createSupport({ message })
    .pipe(
      takeUntil(this._destroyed$),
      tap(x => this._refresh$.next())
    )
    .subscribe();
  }

  ngOnDestroy () {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
