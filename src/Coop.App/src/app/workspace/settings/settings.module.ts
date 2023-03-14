// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MatSliderModule } from '@angular/material/slider';
import { COMMON_FORMS_MODULES } from '@shared/common-forms-modules';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES,
    MatSliderModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }

