// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestsRoutingModule } from './maintenance-requests-routing.module';
import { HtmlEditorModule } from '@shared/html-editor/html-editor.module';
import { MaintenanceRequestListComponent } from './maintenance-request-list/maintenance-request-list.component';
import { COMMON_DIALOG_MODULES, COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';
import { MaintenanceRequestEditorModule } from '@shared/maintenance-request-editor/maintenance-request-editor.module';
import { RouterModule } from '@angular/router';
import { CreateMaintenanceRequestComponent } from './create-maintenance-request/create-maintenance-request.component';
import { AddressEditorModule } from '@shared/address-editor';
import { UnattendedUnitEntryAllowedModule } from '@shared/unattended-unit-entry-allowed/unattended-unit-entry-allowed.module';
import { UpdateMaintenanceRequestDescriptionComponent } from './update-maintenance-request-description/update-maintenance-request-description.component';
import { MaintenanceRequestCompletePopupModule, MaintenanceRequestReceivePopupModule, MaintenanceRequestStartPopupModule, MaintenanceRequestUpdatePopupModule } from '@shared/popups';


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
    COMMON_DIALOG_MODULES,
    UnattendedUnitEntryAllowedModule,
    MaintenanceRequestCompletePopupModule,
    MaintenanceRequestReceivePopupModule,
    MaintenanceRequestStartPopupModule,
    MaintenanceRequestUpdatePopupModule
  ]
})
export class MaintenanceRequestsModule { }

