import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalInterestAndInformationRoutingModule } from './rental-interest-and-information-routing.module';
import { RentalInterestAndInformationComponent } from './rental-interest-and-information.component';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { COMMON_FORMS_MODULES } from '@shared';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';


@NgModule({
  declarations: [
    RentalInterestAndInformationComponent
  ],
  imports: [
    CommonModule,
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    HtmlEditorModule,
    RentalInterestAndInformationRoutingModule
  ]
})
export class RentalInterestAndInformationModule { }
