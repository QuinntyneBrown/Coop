import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageHeadingSubheadingPopupModule } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { OnCallComponent } from './on-call.component';
import { OnCallRoutingModule } from './on-call-routing.module';



@NgModule({
  declarations: [
    OnCallComponent
  ],
  imports: [
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    CommonModule,
    OnCallRoutingModule,
    DragDropModule,
    ImageHeadingSubheadingPopupModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class OnCallModule { }
