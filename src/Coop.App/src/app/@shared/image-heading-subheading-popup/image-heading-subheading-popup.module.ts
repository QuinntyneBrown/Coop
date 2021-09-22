import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageHeadingSubheadingPopupComponent } from './image-heading-subheading-popup.component';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { COMMON_FORMS_MODULES } from '@shared';
import { COMMON_DIALOG_MODULES } from '@shared/common-popup-modules';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    ImageHeadingSubheadingPopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES,
    COMMON_DIALOG_MODULES,
    DigitalAssetUploadModule,
    MatCardModule
  ]
})
export class ImageHeadingSubheadingPopupModule { }
