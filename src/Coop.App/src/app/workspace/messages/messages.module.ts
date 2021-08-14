import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { TypeAMessageModule } from '@shared/type-a-message/type-a-message.module';
import { ToModule } from '@shared/to/to.module';


@NgModule({
  declarations: [
    MessagesComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    ToModule,
    TypeAMessageModule
  ]
})
export class MessagesModule { }
