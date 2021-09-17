import { Component, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JsonContent, JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

const name =  JsonContentName.Hero;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {

  public vm$ = this._jsonContentService.getByName({ name })
  .pipe(
    map(jsonContent => {
      const form = new FormGroup({
        jsonContentId: new FormControl(jsonContent?.jsonContentId,[Validators.required]),
        name: new FormControl(name,[Validators.required]),
        json: new FormGroup({
          logoDigitalAssetId: new FormControl(jsonContent?.json?.logoDigitalAssetId,[Validators.required]),
          heading: new FormControl(jsonContent?.json?.heading, [Validators.required]),
          subHeading: new FormControl(jsonContent?.json?.subHeading, [Validators.required])
        })
      });
      return {
        form
      }
    })
  )

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {

  }
  public save(jsonContent: JsonContent) {
    const obs$ = jsonContent?.jsonContentId
    ? this._jsonContentService.update({ jsonContent})
    : this._jsonContentService.create({ jsonContent });

    obs$.subscribe();
  }

}
