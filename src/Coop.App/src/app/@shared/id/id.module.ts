// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdComponent } from './id.component';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    IdComponent
  ],
  exports: [
    IdComponent
  ],
  imports: [
    CommonModule,
    DigitalAssetUploadModule,
    ReactiveFormsModule
  ]
})
export class IdModule { }

