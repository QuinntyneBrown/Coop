import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ByLawsRoutingModule } from './by-laws-routing.module';
import { ByLawsComponent } from './by-laws.component';
import { ByLawListComponent } from './by-law-list/by-law-list.component';
import { COMMON_FORMS_MODULES, COMMON_TABLE_MODULES } from '@shared';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    ByLawsComponent,
    ByLawListComponent
  ],
  imports: [
    CommonModule,
    ByLawsRoutingModule,
    COMMON_FORMS_MODULES,
    COMMON_TABLE_MODULES,
    MatDialogModule
  ]
})
export class ByLawsModule { }
