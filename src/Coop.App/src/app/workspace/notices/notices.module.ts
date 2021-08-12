import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticesRoutingModule } from './notices-routing.module';
import { NoticesComponent } from './notices.component';


@NgModule({
  declarations: [
    NoticesComponent
  ],
  imports: [
    CommonModule,
    NoticesRoutingModule
  ]
})
export class NoticesModule { }
