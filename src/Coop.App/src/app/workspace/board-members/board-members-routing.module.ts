import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardMemberListComponent } from './board-member-list/board-member-list.component';


const routes: Routes = [{ path: '', component: BoardMemberListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardMembersRoutingModule { }
