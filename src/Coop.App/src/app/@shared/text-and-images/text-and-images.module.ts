// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextAndImagesComponent } from './text-and-images.component';



@NgModule({
  declarations: [
    TextAndImagesComponent
  ],
  exports: [
    TextAndImagesComponent
  ],
  imports: [
    CommonModule
  ]
})
export class TextAndImagesModule { }

