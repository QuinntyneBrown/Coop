// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregatePrivilegeComponent } from './aggregate-privilege.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    AggregatePrivilegeComponent
  ],
  exports: [
    AggregatePrivilegeComponent
  ],
  imports: [
    CommonModule,
    MatIconModule
  ]
})
export class AggregatePrivilegesModule { }

