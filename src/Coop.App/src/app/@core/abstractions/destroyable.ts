// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

