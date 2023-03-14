// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeroComponent
  ],
  exports: [
    HeroComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HeroModule { }

