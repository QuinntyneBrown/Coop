// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
import { AddressEditorIntl } from './address-editor-intl';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-address-editor',
  templateUrl: './address-editor.component.html',
  styleUrls: ['./address-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressEditorComponent),
      multi: true
    }
  ]
})
export class AddressEditorComponent extends BaseControl implements ControlValueAccessor,  Validator  {


  @Input("addressStreetIntl$") _street$: Observable<string> | null = null;

  get street$() {
    return this._street$ ? this._street$ : this.addressEditorIntl.street$;
  }

  readonly form = new FormGroup({
    street: new FormControl(null,[Validators.required]),
    unit: new FormControl(null, []),
    postalCode: new FormControl(null,[Validators.required]),
    city: new FormControl(null,[Validators.required]),
    province: new FormControl(null,[Validators.required])
  });

  constructor(
    private readonly _elementRef: ElementRef,
    public readonly addressEditorIntl: AddressEditorIntl,
  ) { 
    super();
  }

  displayWith(value:any) {
    return typeof value == "string" ? value : null;
  }

  validate(control: AbstractControl): ValidationErrors | null {
      return this.form.valid ? null
      : Object.keys(this.form.controls).reduce(
          (accumulatedErrors, formControlName) => {
            const errors: ValidationErrors = { ...accumulatedErrors };

            const controlErrors = this.form.controls[formControlName].errors;

            if (controlErrors) {
              errors[formControlName] = controlErrors;
            }

            return errors;
          },
          {}
        );
  }

  writeValue(address: any): void {
    if(address == null) {
      this.form.reset();
    } else {
      this.form.patchValue(address, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._elementRef.nativeElement
      .querySelectorAll("*")
      .forEach((element: HTMLElement) => {
        fromEvent(element, "focus")
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

