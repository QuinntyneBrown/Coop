// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-id',
  templateUrl: './id.component.html',
  styleUrls: ['./id.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdComponent),
      multi: true
    }
  ]
})
export class IdComponent extends BaseControl implements Validator  {

  readonly formControl = new FormControl(null,[]);

  @Input() heading1: string;

  @Input() heading2: string;

  constructor(
    private readonly _elementRef: ElementRef
  ) { 
    super();
  }

  validate(control: AbstractControl): ValidationErrors | null {
      return this.formControl.errors;
  }

  writeValue(obj: any): void {
    if(obj == null) {
      this.formControl.reset();
    }
    else {
        this.formControl.patchValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges
    .pipe(takeUntil(this._destroyed$))
    .subscribe(fn);
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
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}

