import { Injectable, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class Destroyable implements OnDestroy {
  protected readonly _destoryed$ = new Subject();

  ngOnDestroy(): void {
    this._destoryed$.next();
    this._destoryed$.complete();
  }
}
