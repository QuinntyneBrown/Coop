import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseControl } from '@core/abstractions/base-control';


@Component({
  selector: 'app-html-editor',
  template: '<div [ngxSummernote]="config" [formControl]="formControl"></div>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlEditorComponent),
      multi: true
    }
  ]
})
export class HtmlEditorComponent extends BaseControl  {

  readonly formControl = new FormControl();

  @Input() config: any = { height: 250 };

  writeValue(obj: any): void {
    if(obj == null) {
      this.formControl.reset();
    }
    else {
      this.formControl.setValue(obj, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.formControl.valueChanges
    .pipe(
      takeUntil(this._destroyed$)
    )
    .subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}
