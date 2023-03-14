// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestEditorComponent } from './maintenance-request-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { DigitalAssetListModule } from '@shared/digital-asset-list/digital-asset-list.module';


@NgModule({
  declarations: [MaintenanceRequestEditorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HtmlEditorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    DigitalAssetUploadModule,
    DigitalAssetListModule
  ],
  exports: [
    MaintenanceRequestEditorComponent
  ]
})
export class MaintenanceRequestEditorModule { }

