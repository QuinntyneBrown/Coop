import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffMembersRoutingModule } from './staff-members-routing.module';
import { StaffMemberListComponent } from './staff-member-list/staff-member-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { StaffMemberComponent } from './staff-member/staff-member.component';


@NgModule({
  declarations: [
    StaffMemberListComponent,
    StaffMemberComponent
  ],
  imports: [
    CommonModule,
    StaffMembersRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class StaffMembersModule { }
