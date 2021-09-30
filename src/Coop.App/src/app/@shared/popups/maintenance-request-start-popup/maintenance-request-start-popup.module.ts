import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestStartPopupComponent } from './maintenance-request-start-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';



@NgModule({
  declarations: [
    MaintenanceRequestStartPopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES
  ]
})
export class MaintenanceRequestStartPopupModule { }
