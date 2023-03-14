// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DigitalAssetService, DigitalAsset } from '@api';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-digital-asset-list',
  templateUrl: './digital-asset-list.component.html',
  styleUrls: ['./digital-asset-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DigitalAssetListComponent),
      multi: true
    }
  ]
})
export class DigitalAssetListComponent extends BaseControl {

  private readonly _refresh$: Subject<void> = new Subject();

  @Output() delete: EventEmitter<DigitalAsset> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @Input() digitalAssets: any[] = [];

  readonly vm$ = this._refresh$
  .pipe(
    startWith(true),
    map(_ => {
      this.pageIndex = 0;
      return {
        digitalAssets: this.digitalAssets,
        columnsToDisplay: ["name", "actions"]
      }
    })
  )

  pageSize = 3;

  pageIndex = 0;

  get start() {
    return this.pageIndex * this.pageSize
  }
  get end() {
    return this.start + this.pageSize
  }

  writeValue(digitalAssets: DigitalAsset[]): void {
    if(digitalAssets) {
      this.digitalAssets = digitalAssets;
    } else {
      this.digitalAssets = [];
    }

  }
}

