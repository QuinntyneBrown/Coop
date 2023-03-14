// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component } from '@angular/core';
import { JsonContentService } from '@api';
import { ContentContextService } from './content-context.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  providers:[ContentContextService]
})
export class ContentComponent {

  constructor(
    private readonly _jsonContentService: JsonContentService
  ) { }
}

