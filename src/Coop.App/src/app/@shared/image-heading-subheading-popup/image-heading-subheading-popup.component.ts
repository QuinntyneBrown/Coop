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

  private _model$: BehaviorSubject<any> = new BehaviorSubject({ });

  public vm$ = this._model$
  .pipe(
    map(model => ({
      form: new FormGroup({
        digitalAssetId: new FormControl(model.digitalAssetId, []),
        heading: new FormControl(model.heading, []),
        subheading: new FormControl(model.subheading, [])
      })
    }))
  );

  constructor(
    private readonly _dialogRef: MatDialogRef<ImageHeadingSubheadingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) model:any,
  ) {
    this._model$.next(model ? model : {});
  }

  public save(model:any) {
    this._dialogRef.close(model);
  }
}