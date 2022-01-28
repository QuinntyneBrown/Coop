import { Component, ElementRef, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MaintenanceRequest } from '@api';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-maintenance-request-editor',
  templateUrl: './maintenance-request-editor.component.html',
  styleUrls: ['./maintenance-request-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MaintenanceRequestEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaintenanceRequestEditorComponent),
      multi: true
    }
  ]
})
export class MaintenanceRequestEditorComponent extends BaseControl implements OnInit, Validator  {


  readonly digitalAssetControl : FormControl = new FormControl(null,[]);

  readonly form = new FormGroup({
    maintenanceRequestId: new FormControl(),
    title: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
    digitalAssets: new FormControl([],[])
  });

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>
  ) { 
    super();
  }


  ngOnInit() {
    this.digitalAssetControl
    .valueChanges
    .pipe(
      takeUntil(this._destroyed$),
      map(digitalAsset => {
        if(digitalAsset) {
          const control = this.form.get("digitalAssets");

          let digitalAssets = control.value || [];

          digitalAssets.push(digitalAsset);

          control.setValue(digitalAssets);

          this.digitalAssetControl.setValue(null);
        }
      })
    ).subscribe();
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.valid
      ? null
      : Object.keys(this.form.controls).reduce(
          (accumulatedErrors, formControlName) => {
            const errors = { ...accumulatedErrors };

            const controlErrors = this.form.controls[formControlName].errors;

            if (controlErrors) {
              errors[formControlName] = controlErrors;
            }

            return errors;
          },
          {}
        );
  }

  writeValue(maintenanceRequest: MaintenanceRequest): void {
    if(maintenanceRequest == null) {
      this.form.reset({
        digitalAssets: []
      })
    }
    else {
      this.form.patchValue(maintenanceRequest, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._elementRef.nativeElement
      .querySelectorAll("*")
      .forEach((element: HTMLElement) => {
        fromEvent(element, "blur")
          .pipe(
            takeUntil(this._destroyed$),
            tap(x => fn())
          )
          .subscribe();
      });
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }
}
