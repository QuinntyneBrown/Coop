import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CssCustomPropertyService, ProfileCssCustomPropertyService } from '@api';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

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

      let fontSize = options.cssCustomProperties.filter(x => x.name == "--font-size")[0];
      let cssCustomPropertyId = null;

      if(options.profileCssCustomProperties?.length > 0) {
        fontSize = options.profileCssCustomProperties.filter(x => x.name == "--font-size")[0];
        cssCustomPropertyId = fontSize.cssCustomPropertyId;
      }

      const form: FormGroup = new FormGroup({
        cssCustomPropertyId: new FormControl(cssCustomPropertyId,[]),
        value: new FormControl(fontSize.value.replace("rem",""),[Validators.required]),
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

    if(vm.form.value.cssCustomPropertyId) {
      this._cssCustomPropertyService.update({
        cssCustomProperty: vm.form.value
      }).subscribe()

    } else {
      this._profileCssCustomPropertyService.create({
        profileCssCustomProperty: {
          cssCustomProperty: vm.form.value
        }
      }).subscribe();
    }

    window.location.href = '/workspace';
  }
}
