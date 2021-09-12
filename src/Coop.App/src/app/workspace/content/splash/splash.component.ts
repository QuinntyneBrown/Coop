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
        jsonContentId: content.jsonContentId,
        form: new FormGroup({
          doors: new FormControl(content.json.doors, []),
          building: new FormControl(content.json.building, []),
          rawText: new FormControl(content.json.rawText, []),
        })
      }
    })
  );

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) {

  }

  public save(jsonContentId, json) {



    let el = document.createElement("div");

    let image1 = document.createElement('img');
    image1.src = `https://localhost:5001/api/digitalasset/serve/${json.doors}`;

    let image2 = document.createElement('img');
    image2.src = `https://localhost:5001/api/digitalasset/serve/${json.building}`;

    el.innerHTML = json.rawText;

    el.children[0].parentNode.insertBefore(image1,el.children[0]);

    el.children[2].parentNode.insertBefore(image2,el.children[2]);


    json.text = el.innerHTML;

    console.log(el.innerHTML);

    let jsonContent: JsonContent = {
      jsonContentId: jsonContentId,
      json,
      name: JsonContentName.Landing
    };

    let obs$ = jsonContentId ? this._jsonContentService.update({ jsonContent }) : this._jsonContentService.create({ jsonContent });


    console.log(jsonContent);

    obs$
    .subscribe();


  }
}
