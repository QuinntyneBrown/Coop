import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '@api';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {

  private readonly _destroyed = new Subject();

  public fontSizeControl: FormControl = new FormControl(1, []);

  public vm$ = this._themeService.getDefault()
  .pipe(

    map(theme => {
      const form: FormGroup = new FormGroup({
        themeId: new FormControl(theme.themeId,[Validators.required]),
        cssCustomProperties: new FormGroup({
          "--font-size": new FormControl(theme.cssCustomProperties["--font-size"].replace("px",""), [Validators.required])
        })
      });

      return {
        form
      }
    })
  );

  constructor(
    private readonly _themeService: ThemeService,
    private readonly _router: Router
  ) { }

  public cancel() {
    this._router.navigate(['/','workspace'])
  }

  public tryToSave(vm: { form: FormGroup }) {

    vm.form.value.cssCustomProperties["--font-size"] = vm.form.value.cssCustomProperties["--font-size"] + "px";

    this._themeService.update({ theme: vm.form.value })
    .pipe(
      tap(_ => window.location.href = '/workspace')
    )
    .subscribe()
  }

  public ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
