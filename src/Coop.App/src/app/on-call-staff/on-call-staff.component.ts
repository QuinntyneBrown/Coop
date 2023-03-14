// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject } from '@angular/core';
import { JsonContentName, JsonContentService } from '@api';
import { baseUrl } from '@core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-on-call-staff',
  templateUrl: './on-call-staff.component.html',
  styleUrls: ['./on-call-staff.component.scss']
})
export class OnCallStaffComponent {

  readonly vm$ = this._jsonContentService.getByName({ name: JsonContentName.OnCall })
  .pipe(
    map(jsonContent => ({
      boardMembers: jsonContent.json.onCallStaff,
      heading: jsonContent.json.heading,
      subheading: jsonContent.json.subheading
    }))
  );

  constructor(
    private readonly _jsonContentService: JsonContentService,
    @Inject(baseUrl) readonly baseUrl: string
  ) { }

}

