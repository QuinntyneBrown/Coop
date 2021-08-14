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
