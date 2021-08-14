import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestsRoutingModule } from './maintenance-requests-routing.module';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { MaintenanceRequestListComponent } from './maintenance-request-list/maintenance-request-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';
import { MaintenanceRequestEditorModule } from '@shared/maintenance-request-editor/maintenance-request-editor.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    MaintenanceRequestListComponent,
    MaintenanceRequestComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRequestsRoutingModule,
    HtmlEditorModule,
    MaintenanceRequestEditorModule,
    RouterModule,
    COMMON_TABLE_MODULES,
    COMMON_FORMS_MODULES
  ]
})
export class MaintenanceRequestsModule { }
