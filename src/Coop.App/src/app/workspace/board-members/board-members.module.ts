import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardMembersRoutingModule } from './board-members-routing.module';
import { BoardMembersComponent } from './board-members.component';


@NgModule({
  declarations: [
    BoardMembersComponent
  ],
  imports: [
    CommonModule,
    BoardMembersRoutingModule
  ]
})
export class BoardMembersModule { }
