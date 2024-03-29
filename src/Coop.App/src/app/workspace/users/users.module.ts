// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { UserComponent } from './user/user.component';
import { BentoBoxModule } from '@shared/bento-box';
import { MatDialogModule } from '@angular/material/dialog';
import { IdModule } from '@shared/id/id.module';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserEditorComponent,
    UserComponent
  ],
  imports: [
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    IdModule,
    BentoBoxModule,
    CommonModule,
    UsersRoutingModule,
    MatDialogModule,
    DigitalAssetUploadModule,
    MatTabsModule,
    MatPaginatorModule
  ]
})
export class UsersModule { }

