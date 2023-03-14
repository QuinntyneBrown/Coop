// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';


@NgModule({
  declarations: [
    ContentComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES
  ]
})
export class ContentModule { }

