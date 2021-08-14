import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil} from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { DigitalAssetService, DigitalAsset } from '@api';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class DigitalAssetListComponent implements OnDestroy, ControlValueAccessor {

  private readonly _destroyed$: Subject<void> = new Subject();

  private readonly _refresh$: Subject<void> = new Subject();

  @Output() public delete: EventEmitter<DigitalAsset> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @Input() public digitalAssets: any[] = [];

  public readonly vm$ = this._refresh$
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

  public pageSize = 3;

  public pageIndex = 0;

  public get start() {
    return this.pageIndex * this.pageSize
  }
  public get end() {
    return this.start + this.pageSize
  }

  constructor(
    private readonly _digitalAssetService: DigitalAssetService,
  ) {

  }

  writeValue(digitalAssets: DigitalAsset[]): void {
    if(digitalAssets) {
      this.digitalAssets = digitalAssets;
    } else {
      this.digitalAssets = [];
    }

  }

  registerOnChange(fn: any): void {

  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
