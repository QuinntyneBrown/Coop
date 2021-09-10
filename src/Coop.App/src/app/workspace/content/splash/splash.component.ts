import { FocusMonitor } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { JsonContent, JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent {

  public vm$ = this._jsonContentService.getByName({ name: JsonContentName.Landing })
  .pipe(
    map(content => {
      return {
        form: new FormGroup({
          jsonContentId: new FormControl(null, []),
          doors: new FormControl(null, []),
          building: new FormControl(null, []),
          text: new FormControl(null, [])
        })
      }
    })
  );

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {

  }

  public save(form) {

    let obs$ = form.value.jsonContentId ? this._jsonContentService.update : this._jsonContentService.create;

    let jsonContent: JsonContent = {
      jsonContentId: form.value.jsonContentId,
      json: form.value,
      name: JsonContentName.Landing
    };

    obs$({ jsonContent })
    .subscribe();


  }
}
