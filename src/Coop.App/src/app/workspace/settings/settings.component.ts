import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CssCustomPropertyService, ProfileCssCustomPropertyService } from '@api';
import { combineLatest, Subject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {

  private readonly _destroyed = new Subject();

  public fontSizeControl: FormControl = new FormControl(1, []);

  public vm$ = combineLatest([
    this._cssCustomPropertyService.get(),
    this._profileCssCustomPropertyService.getCurrent()
  ])
  .pipe(
    map(([
      cssCustomProperties,
      profileCssCustomProperties
    ]) => ({ cssCustomProperties, profileCssCustomProperties })),
    map(options => {

      let systemFontSize = options.cssCustomProperties.filter(x => x.name == "--font-size")[0];
      let fontSize = options.cssCustomProperties.filter(x => x.name == "--font-size")[0];
      let cssCustomPropertyId = null;

      if(options.profileCssCustomProperties?.length > 0) {
        fontSize = options.profileCssCustomProperties.filter(x => x.name == "--font-size")[0];
        cssCustomPropertyId = fontSize.cssCustomPropertyId;
      }

      const form: FormGroup = new FormGroup({
        cssCustomPropertyId: new FormControl(cssCustomPropertyId,[]),
        fontSize: new FormControl(fontSize.value.replace("rem",""),[Validators.required]),
        systemFontSize: new FormControl(systemFontSize.value.replace("rem",""),[Validators.required]),
        name: new FormControl('--font-size',[Validators.required])
      });

      return {
        form
      }
    })
  );

  constructor(
    private readonly _cssCustomPropertyService: CssCustomPropertyService,
    private readonly _profileCssCustomPropertyService: ProfileCssCustomPropertyService,
    private readonly _router: Router
  ) { }

  public cancel() {
    this._router.navigate(['/','workspace'])
  }

  public tryToSave(vm: { form: FormGroup }) {
    vm.form.value.value = `${vm.form.value.value}rem`;

    const obs$: Observable<any> = vm.form.value.cssCustomPropertyId
    ? this._cssCustomPropertyService.update({ cssCustomProperty: vm.form.value })
    : this._profileCssCustomPropertyService.create({ profileCssCustomProperty: vm.form.value });

    obs$
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
