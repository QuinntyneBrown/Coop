// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleEditorComponent } from './role-editor/role-editor.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { RoleComponent } from './role/role.component';
import { BentoBoxModule } from '@shared';
import { AggregatePrivilegesModule } from '@shared/aggregate-privilege/aggregate-privilege.module';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleDetailComponent,
    RoleEditorComponent,
    RoleComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    BentoBoxModule,
    AggregatePrivilegesModule,
    MatDialogModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES
  ]
})
export class RolesModule { }

