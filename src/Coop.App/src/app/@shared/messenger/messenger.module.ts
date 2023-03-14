// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessengerComponent } from './messenger.component';



@NgModule({
  declarations: [
    MessengerComponent
  ],
  exports: [
    MessengerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MessengerModule { }

