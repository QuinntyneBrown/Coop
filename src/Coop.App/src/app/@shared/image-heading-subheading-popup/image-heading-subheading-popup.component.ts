// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-image-heading-subheading-popup',
  templateUrl: './image-heading-subheading-popup.component.html',
  styleUrls: ['./image-heading-subheading-popup.component.scss']
})
export class ImageHeadingSubheadingPopupComponent {

  private readonly _model$: BehaviorSubject<any> = new BehaviorSubject({ });

  readonly vm$ = this._model$
  .pipe(
    map(model => ({
      form: new FormGroup({
        digitalAssetId: new FormControl(model.digitalAssetId, []),
        heading: new FormControl(model.heading, []),
        subheading: new FormControl(model.subheading, []),
        subheading2: new FormControl(model.subheading2)
      })
    }))
  );

  constructor(
    private readonly _dialogRef: MatDialogRef<ImageHeadingSubheadingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) model:any,
  ) {
    this._model$.next(model ? model : {});
  }

  save(model:any) {
    this._dialogRef.close(model);
  }
}

