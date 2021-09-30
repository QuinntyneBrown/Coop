import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestCompletePopupComponent } from './maintenance-request-complete-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';



@NgModule({
  declarations: [
    MaintenanceRequestCompletePopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES
  ]
})
export class MaintenanceRequestCompletePopupModule { }
