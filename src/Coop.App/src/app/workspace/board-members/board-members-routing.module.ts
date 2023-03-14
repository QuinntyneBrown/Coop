// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardMemberListComponent } from './board-member-list/board-member-list.component';
import { BoardMemberComponent } from './board-member/board-member.component';


const routes: Routes = [
  { path: '', component: BoardMemberListComponent },
  { path: 'create', component: BoardMemberComponent },
  { path: 'edit/:id', component: BoardMemberComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardMembersRoutingModule { }

