// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { DigitalAsset, DigitalAssetService} from '@api';
import { baseUrl } from '@core';
import { BaseControlValueAccessor } from '@core/base-control';

@Component({
  selector: 'app-digital-asset-upload',
  templateUrl: './digital-asset-upload.component.html',
  styleUrls: ['./digital-asset-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DigitalAssetUploadComponent),
      multi: true
    }
  ]
})
export class DigitalAssetUploadComponent extends BaseControlValueAccessor implements AfterViewInit {

  readonly digitalAssetIdBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject(null);

  readonly digitalAsset$: Subject<DigitalAsset> = new Subject();

  readonly digitalAssetId$: Subject<string| DigitalAsset> = new Subject();

  @Input() icon:string = "file_upload";
  
  @Input() idOnly: boolean = true;

  constructor(
    private readonly _digitalAssetService: DigitalAssetService,
    private readonly _elementRef: ElementRef,
    @Inject(baseUrl) readonly baseUrl: string
  ) {
    super();
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  writeValue(obj: any): void {
    this.digitalAssetIdBehaviorSubject.next(obj);
  }

  registerOnChange(fn: any): void {
    this.digitalAssetId$
    .pipe(
      takeUntil(this._destroyed$)
    ).subscribe(fn);
  }

  ngAfterViewInit(): void {
    fromEvent(this._elementRef.nativeElement,"dragover")
    .pipe(
      tap((x: DragEvent) => this.onDragOver(x)),
      takeUntil(this._destroyed$)
    ).subscribe();

    fromEvent(this._elementRef.nativeElement,"drop")
    .pipe(
      tap((x: DragEvent) => this.onDrop(x)),
      takeUntil(this._destroyed$)
    ).subscribe();
  }

  onDragOver(e: DragEvent): void {
    e.stopPropagation();
    e.preventDefault();
  }

  async onDrop(e: DragEvent): Promise<any> {
    e.stopPropagation();
    e.preventDefault();

    if (e.dataTransfer && e.dataTransfer.files) {
      const packageFiles = function (fileList: FileList): FormData {
        const formData = new FormData();
        for (var i = 0; i < fileList.length; i++) {
          formData.append(fileList[i].name, fileList[i]);
        }
        return formData;
      }

      const data = packageFiles(e.dataTransfer.files);

      this._digitalAssetService.upload({ data })
        .pipe(
          switchMap((x) => this._digitalAssetService.getByIds({ digitalAssetIds: x.digitalAssetIds })),
          tap(x => {
            if(this.idOnly) {
              this.digitalAssetId$.next(x[0].digitalAssetId)
            }else {
              this.digitalAssetId$.next(x[0])
            }
          }),
          takeUntil(this._destroyed$)
        )
        .subscribe();
    }
  }
}

