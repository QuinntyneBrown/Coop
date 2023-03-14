// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject } from '@angular/core';
import { JsonContentName, JsonContentService } from '@api';
import { baseUrl } from '@core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent {

  readonly vm$ = this._jsonContentService.getByName({ name: JsonContentName.ManagementStaff })
  .pipe(
    map(jsonContent => ({
      boardMembers: jsonContent.json.managementStaff,
      heading: jsonContent.json.heading,
      subheading: jsonContent.json.subheading
    }))
  );

  constructor(
    private readonly _jsonContentService: JsonContentService,
    @Inject(baseUrl) public readonly baseUrl: string
  ) { }

}

