// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestComponent } from './maintenance-request.component';



@NgModule({
  declarations: [
    MaintenanceRequestComponent
  ],
  exports: [
    MaintenanceRequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MaintenanceRequestModule { }

