// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeroRoutingModule } from './hero-routing.module';
import { HeroComponent } from './hero.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';


@NgModule({
  declarations: [
    HeroComponent
  ],
  imports: [
    CommonModule,
    HeroRoutingModule,
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES
  ]
})
export class HeroModule { }

