// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { COMMON_FORMS_MODULES } from '@shared';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';


@NgModule({
  declarations: [
    ContactUsComponent
  ],
  imports: [
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    HtmlEditorModule,
    CommonModule,
    ContactUsRoutingModule
  ]
})
export class ContactUsModule { }

