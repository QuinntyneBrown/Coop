import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ByLawsRoutingModule } from './by-laws-routing.module';
import { ByLawListComponent } from './by-law-list/by-law-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateDocumentPopupModule } from '@shared/popups/create-document-popup/create-document-popup.module';


@NgModule({
  declarations: [
    ByLawListComponent
  ],
  imports: [
    CommonModule,
    CreateDocumentPopupModule,
    ByLawsRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class ByLawsModule { }
