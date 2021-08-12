import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffMembersComponent } from './staff-members.component';

const routes: Routes = [{ path: '', component: StaffMembersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffMembersRoutingModule { }
