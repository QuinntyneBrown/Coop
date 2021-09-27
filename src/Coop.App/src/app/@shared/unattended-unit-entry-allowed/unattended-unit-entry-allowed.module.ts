import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnattendedUnitEntryAllowedComponent } from './unattended-unit-entry-allowed.component';
import { COMMON_FORMS_MODULES } from '@shared';



@NgModule({
  declarations: [
    UnattendedUnitEntryAllowedComponent
  ],
  exports: [
    UnattendedUnitEntryAllowedComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES
  ]
})
export class UnattendedUnitEntryAllowedModule { }
