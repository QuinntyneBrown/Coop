import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnCallRoutingModule } from './on-call-routing.module';
import { OnCallComponent } from './on-call.component';


@NgModule({
  declarations: [
    OnCallComponent
  ],
  imports: [
    CommonModule,
    OnCallRoutingModule
  ]
})
export class OnCallModule { }
