// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestCompletePopupComponent } from './maintenance-request-complete-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MaintenanceRequestModule } from '@shared/maintenance-request/maintenance-request.module';
import { COMMON_DIALOG_MODULES } from '@shared/common-popup-modules';
import { COMMON_FORMS_MODULES } from '@shared/common-forms-modules';

@NgModule({
  declarations: [
    MaintenanceRequestCompletePopupComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  imports: [
    CommonModule,
    COMMON_DIALOG_MODULES,
    COMMON_FORMS_MODULES,
    MatDatepickerModule,
    MaintenanceRequestModule
  ]
})
export class MaintenanceRequestCompletePopupModule { }

