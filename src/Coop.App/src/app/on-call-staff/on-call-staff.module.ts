// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnCallStaffRoutingModule } from './on-call-staff-routing.module';
import { OnCallStaffComponent } from './on-call-staff.component';


@NgModule({
  declarations: [
    OnCallStaffComponent
  ],
  imports: [
    CommonModule,
    OnCallStaffRoutingModule
  ]
})
export class OnCallStaffModule { }

