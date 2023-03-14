// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalAssetUploadComponent } from './digital-asset-upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LogoModule } from '@shared/logo';

@NgModule({
  declarations: [DigitalAssetUploadComponent],
  exports:[DigitalAssetUploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    LogoModule
  ]
})
export class DigitalAssetUploadModule { }

