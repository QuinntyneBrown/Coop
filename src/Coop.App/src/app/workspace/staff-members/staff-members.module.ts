import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffMembersRoutingModule } from './staff-members-routing.module';
import { StaffMembersComponent } from './staff-members.component';


@NgModule({
  declarations: [
    StaffMembersComponent
  ],
  imports: [
    CommonModule,
    StaffMembersRoutingModule
  ]
})
export class StaffMembersModule { }
