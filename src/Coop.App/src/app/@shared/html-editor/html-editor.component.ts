import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


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
export class HtmlEditorComponent implements ControlValueAccessor  {

  private readonly _destroyed$: Subject<void> = new Subject();

  public formControl = new FormControl();

  @Input() public config: any = { height: 250 };

  constructor(
    private readonly _domSanitizer: DomSanitizer
  ) {  }

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

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}
