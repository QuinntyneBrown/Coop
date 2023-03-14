// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentCardComponent } from './document-card.component';



@NgModule({
  declarations: [
    DocumentCardComponent
  ],
  exports: [
    DocumentCardComponent
  ],
  imports: [
    CommonModule
  ]
})
export class DocumentCardModule { }

