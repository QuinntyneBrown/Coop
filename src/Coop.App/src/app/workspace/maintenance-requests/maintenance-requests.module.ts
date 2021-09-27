import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestsRoutingModule } from './maintenance-requests-routing.module';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { MaintenanceRequestListComponent } from './maintenance-request-list/maintenance-request-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';
import { MaintenanceRequestEditorModule } from '@shared/maintenance-request-editor/maintenance-request-editor.module';
import { RouterModule } from '@angular/router';
import { CreateMaintenanceRequestComponent } from './create-maintenance-request/create-maintenance-request.component';
import { AddressEditorModule } from '@shared/address-editor';
import { UnattendedUnitEntryAllowedModule } from '@shared/unattended-unit-entry-allowed/unattended-unit-entry-allowed.module';
import { UpdateMaintenanceRequestDescriptionComponent } from './update-maintenance-request-description/update-maintenance-request-description.component';


@NgModule({
  declarations: [
    MaintenanceRequestListComponent,
    MaintenanceRequestComponent,
    CreateMaintenanceRequestComponent,
    UpdateMaintenanceRequestDescriptionComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRequestsRoutingModule,
    HtmlEditorModule,
    MaintenanceRequestEditorModule,
    RouterModule,
    AddressEditorModule,
    COMMON_TABLE_MODULES,
    COMMON_FORMS_MODULES,
    UnattendedUnitEntryAllowedModule
  ]
})
export class MaintenanceRequestsModule { }
