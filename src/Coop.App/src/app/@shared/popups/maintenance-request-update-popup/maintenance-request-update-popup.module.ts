import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestUpdatePopupComponent } from './maintenance-request-update-popup.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES } from '@shared';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { MaintenanceRequestModule } from '@shared/maintenance-request/maintenance-request.module';



@NgModule({
  declarations: [
    MaintenanceRequestUpdatePopupComponent
  ],
  imports: [
    CommonModule,
    HtmlEditorModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES,
    MaintenanceRequestModule
  ]
})
export class MaintenanceRequestUpdatePopupModule { }
