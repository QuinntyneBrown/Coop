import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnCallStaffComponent } from './on-call-staff.component';

const routes: Routes = [{ path: '', component: OnCallStaffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnCallStaffRoutingModule { }
