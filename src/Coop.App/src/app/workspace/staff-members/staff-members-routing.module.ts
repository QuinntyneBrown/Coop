import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffMemberListComponent } from './staff-member-list/staff-member-list.component';
import { StaffMemberComponent } from './staff-member/staff-member.component';


const routes: Routes = [
  { path: '', component: StaffMemberListComponent },
  { path: 'create', component: StaffMemberComponent },
  { path: 'edit/:id', component: StaffMemberComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffMembersRoutingModule { }
