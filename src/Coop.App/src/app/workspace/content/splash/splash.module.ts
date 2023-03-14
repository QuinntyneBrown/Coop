// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashRoutingModule } from './splash-routing.module';
import { SplashComponent } from './splash.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';


@NgModule({
  declarations: [
    SplashComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES,
    SplashRoutingModule,
    HtmlEditorModule,
    DigitalAssetUploadModule
  ]
})
export class SplashModule { }

