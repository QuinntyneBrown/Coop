import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardMembersRoutingModule } from './board-members-routing.module';
import { BoardMemberListComponent } from './board-member-list/board-member-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardMemberComponent } from './board-member/board-member.component';


@NgModule({
  declarations: [
    BoardMemberListComponent,
    BoardMemberComponent
  ],
  imports: [
    CommonModule,
    BoardMembersRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class BoardMembersModule { }
