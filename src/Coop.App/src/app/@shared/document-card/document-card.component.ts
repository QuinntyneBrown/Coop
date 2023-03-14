// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject, Input } from '@angular/core';
import { Document } from '@api';
import { baseUrl } from '@core';

@Component({
  selector: 'app-document-card',
  templateUrl: './document-card.component.html',
  styleUrls: ['./document-card.component.scss']
})
export class DocumentCardComponent {

  @Input() document!: Document;

  constructor(
    @Inject(baseUrl) readonly baseUrl: string
  ) {}
}

