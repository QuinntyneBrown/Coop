import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageHeadingSubheadingPopupModule } from '@shared/image-heading-subheading-popup/image-heading-subheading-popup.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    CommonModule,
    BoardRoutingModule,
    DragDropModule,
    ImageHeadingSubheadingPopupModule,
    MatDialogModule,
    MatIconModule
  ]
})
export class BoardModule { }
