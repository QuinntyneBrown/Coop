// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BentoBoxComponent } from './bento-box.component';


@NgModule({
  declarations: [
    BentoBoxComponent
  ],
  exports: [
    BentoBoxComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BentoBoxModule { }

