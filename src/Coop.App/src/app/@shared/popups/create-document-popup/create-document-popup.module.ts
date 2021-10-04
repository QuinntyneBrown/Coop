import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateDocumentPopupComponent } from './create-document-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';



@NgModule({
  declarations: [
    CreateDocumentPopupComponent
  ],
  exports: [
    CreateDocumentPopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES,
    DigitalAssetUploadModule
  ]
})
export class CreateDocumentPopupModule { }
