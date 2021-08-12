import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardMembersComponent } from './board-members.component';

const routes: Routes = [{ path: '', component: BoardMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardMembersRoutingModule { }
