import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticesRoutingModule } from './notices-routing.module';
import { NoticeListComponent } from './notice-list/notice-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    NoticeListComponent
  ],
  imports: [
    CommonModule,
    NoticesRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class NoticesModule { }
