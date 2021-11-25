import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Destoryable implements OnDestroy {

  protected readonly _destroyed$: Subject<void> = new Subject();

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
