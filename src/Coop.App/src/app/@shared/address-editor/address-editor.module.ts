// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressEditorComponent } from './address-editor.component';
import { COMMON_FORMS_MODULES } from '@shared/common-forms-modules';

@NgModule({
  declarations: [
    AddressEditorComponent
  ],
  exports: [
    AddressEditorComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES
  ]
})
export class AddressEditorModule { }

