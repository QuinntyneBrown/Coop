// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestReceivePopupComponent } from './maintenance-request-receive-popup.component';
import { MaintenanceRequestModule } from '@shared/maintenance-request/maintenance-request.module';
import { COMMON_DIALOG_MODULES } from '@shared/common-popup-modules';
import { COMMON_FORMS_MODULES } from '@shared/common-forms-modules';


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
    COMMON_FORMS_MODULES,
    MaintenanceRequestModule
  ]
})
export class MaintenanceRequestReceivePopupModule { }

