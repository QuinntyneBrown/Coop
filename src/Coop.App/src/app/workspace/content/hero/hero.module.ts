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
