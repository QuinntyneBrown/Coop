import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormArray, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { map, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { BaseControl } from '@core/abstractions/base-control';

@Component({
  selector: 'app-unattended-unit-entry-allowed',
  templateUrl: './unattended-unit-entry-allowed.component.html',
  styleUrls: ['./unattended-unit-entry-allowed.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UnattendedUnitEntryAllowedComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UnattendedUnitEntryAllowedComponent),
      multi: true
    }
  ]
})
export class UnattendedUnitEntryAllowedComponent extends BaseControl implements  Validator   {
 
  readonly form = new FormGroup({
    unattendedUnitEntryAllowed: new FormControl(null, [Validators.required]),
    unattendedUnitEntryNotAllowed: new FormControl(null, [Validators.required])
  });

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>
  ) { 
    super();
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

  writeValue(unattendedUnitEntryAllowed: boolean): void {
    if(unattendedUnitEntryAllowed == null) {
      this.form.reset();
    }
    else {
        this.form.patchValue({
          unattendedUnitEntryAllowed,
          unattendedUnitEntryNotAllowed: !unattendedUnitEntryAllowed
        }, { emitEvent: false });
    }

    this.form.get("unattendedUnitEntryAllowed")
    .valueChanges
    .pipe(
      takeUntil(this._destroyed$),
      tap(value => {
        (this.form.get("unattendedUnitEntryNotAllowed") as FormControl).patchValue(!value, { emitEvent: false });
      }),
    ).subscribe();

    this.form.get("unattendedUnitEntryNotAllowed")
    .valueChanges
    .pipe(
      takeUntil(this._destroyed$),
      tap(value => {
        (this.form.get("unattendedUnitEntryAllowed") as FormControl).patchValue(!value, { emitEvent: false });
      }),
    ).subscribe();

  }

  registerOnChange(fn: any): void {
    this.form.valueChanges
    .pipe(
      takeUntil(this._destroyed$),
      map(value => value?.unattendedUnitEntryAllowed)
      )
    .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this._elementRef.nativeElement
      .querySelectorAll("*")
      .forEach((element) => {
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
