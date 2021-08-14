import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalAssetsRoutingModule } from './digital-assets-routing.module';
import { DigitalAssetsComponent } from './digital-assets.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { DigitalAssetListComponent } from './digital-asset-list/digital-asset-list.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    DigitalAssetsComponent,
    DigitalAssetListComponent
  ],
  imports: [
    CommonModule,
    DigitalAssetsRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class DigitalAssetsModule { }
