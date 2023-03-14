// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalizeRoutingModule } from './personalize-routing.module';
import { PersonalizeComponent } from './personalize.component';


@NgModule({
  declarations: [
    PersonalizeComponent
  ],
  imports: [
    CommonModule,
    PersonalizeRoutingModule
  ]
})
export class PersonalizeModule { }

