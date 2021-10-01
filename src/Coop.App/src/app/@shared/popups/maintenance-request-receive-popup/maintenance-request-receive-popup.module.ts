import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestReceivePopupComponent } from './maintenance-request-receive-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';



@NgModule({
  declarations: [
    MaintenanceRequestReceivePopupComponent
  ],
  exports: [
    MaintenanceRequestReceivePopupComponent
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES
  ]
})
export class MaintenanceRequestReceivePopupModule { }
