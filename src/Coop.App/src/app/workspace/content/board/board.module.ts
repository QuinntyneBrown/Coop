import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardRoutingModule } from './board-routing.module';
import { BoardComponent } from './board.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';


@NgModule({
  declarations: [
    BoardComponent
  ],
  imports: [
    DigitalAssetUploadModule,
    COMMON_FORMS_MODULES,
    CommonModule,
    BoardRoutingModule
  ]
})
export class BoardModule { }
