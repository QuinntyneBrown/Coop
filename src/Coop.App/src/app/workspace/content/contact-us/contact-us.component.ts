// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JsonContent, JsonContentName, JsonContentService } from '@api';
import { map } from 'rxjs/operators';

const name = JsonContentName.ContactUs;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent  {
  public vm$ = this._jsonContentService.getByName({ name })
  .pipe(
    map(jsonContent => {
      const form = new FormGroup({
        jsonContentId: new FormControl(jsonContent?.jsonContentId,[Validators.required]),
        name: new FormControl(name, [Validators.required]),
        json: new FormGroup({
          heading: new FormControl(jsonContent?.json?.heading, [Validators.required]),
          subHeading: new FormControl(jsonContent?.json?.subHeading, [Validators.required]),
          body: new FormControl(jsonContent?.json?.body, [Validators.required]),
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

