import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateDocumentPopupModule } from '@shared/popups/create-document-popup/create-document-popup.module';


@NgModule({
  declarations: [
    ReportListComponent
  ],
  imports: [
    CommonModule,
    CreateDocumentPopupModule,
    ReportsRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class ReportsModule { }
