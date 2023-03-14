// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, ElementRef, EventEmitter, forwardRef, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-type-a-message',
  templateUrl: './type-a-message.component.html',
  styleUrls: ['./type-a-message.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeAMessageComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TypeAMessageComponent),
      multi: true
    }
  ]
})
export class TypeAMessageComponent extends BaseControl implements Validator  {


  readonly formControl = new FormControl(null,[]);

  @Output() send: EventEmitter<string> = new EventEmitter();

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>
  ) { 
    super();
  }

  handleSendClick() {
    this.send.emit(this.formControl.value);
    this.formControl.setValue(null);
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

