import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestUpdatePopupComponent } from './maintenance-request-update-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';



@NgModule({
  declarations: [
    MaintenanceRequestUpdatePopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES
  ]
})
export class MaintenanceRequestUpdatePopupModule { }
