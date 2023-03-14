// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentalInterestAndInformationRoutingModule } from './rental-interest-and-information-routing.module';
import { RentalInterestAndInformationComponent } from './rental-interest-and-information.component';


@NgModule({
  declarations: [
    RentalInterestAndInformationComponent
  ],
  imports: [
    CommonModule,
    RentalInterestAndInformationRoutingModule
  ]
})
export class RentalInterestAndInformationModule { }

