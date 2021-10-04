import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Destroyable } from '@core/destroyable';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-document-popup',
  templateUrl: './create-document-popup.component.html',
  styleUrls: ['./create-document-popup.component.scss']
})
export class CreateDocumentPopupComponent extends Destroyable implements OnInit {

  public form: FormGroup = new FormGroup({
    name: new FormControl(null,[Validators.required]),
    digitalAsset: new FormControl(null,[]),
    digitalAssetId: new FormControl(null,[Validators.required])
  })

  constructor(
    private readonly _dialogRef: MatDialogRef<CreateDocumentPopupComponent>
  ) {
    super();
  }

  ngOnInit() {
    var digitalAssetControl = this.form.get("digitalAsset");
    var digitalAssetIdControl = this.form.get("digitalAssetId");

    digitalAssetControl
    .valueChanges
    .pipe(
      takeUntil(this._destroyed$),
      map(x => digitalAssetIdControl.patchValue(x.digitalAssetId))
    ).subscribe();
  }

  public handleSaveClick() {
    this._dialogRef.close(this.form.value);
  }

}
