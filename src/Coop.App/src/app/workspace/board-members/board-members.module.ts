import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardMembersRoutingModule } from './board-members-routing.module';
import { BoardMemberListComponent } from './board-member-list/board-member-list.component';
import { BentoBoxModule, COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardMemberComponent } from './board-member/board-member.component';
import { IdModule } from '@shared/id/id.module';
import { DigitalAssetUploadModule } from '@shared/digital-asset-upload/digital-asset-upload.module';
import { MatPaginatorModule } from '@angular/material/paginator';


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
    MatDialogModule,
    IdModule,
    BentoBoxModule,
    DigitalAssetUploadModule,
    MatPaginatorModule
  ]
})
export class BoardMembersModule { }
