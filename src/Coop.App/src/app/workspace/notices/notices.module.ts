// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticesRoutingModule } from './notices-routing.module';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateDocumentPopupModule } from '@shared/popups/create-document-popup/create-document-popup.module';


@NgModule({
  declarations: [
    NoticeListComponent
  ],
  imports: [
    CommonModule,
    CreateDocumentPopupModule,
    NoticesRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class NoticesModule { }

