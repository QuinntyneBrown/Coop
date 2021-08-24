import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardOfDirectorsRoutingModule } from './board-of-directors-routing.module';
import { BoardOfDirectorsComponent } from './board-of-directors.component';


@NgModule({
  declarations: [
    BoardOfDirectorsComponent
  ],
  imports: [
    CommonModule,
    BoardOfDirectorsRoutingModule
  ]
})
export class BoardOfDirectorsModule { }
