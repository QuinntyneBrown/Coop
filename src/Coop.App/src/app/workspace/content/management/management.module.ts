// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageHeadingSubheadingPopupModule } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';


@NgModule({
  declarations: [
    ManagementComponent
  ],
  imports: [
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    CommonModule,
    ManagementRoutingModule,
    DragDropModule,
    ImageHeadingSubheadingPopupModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class ManagementModule { }

