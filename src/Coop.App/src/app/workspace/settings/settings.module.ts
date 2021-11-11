import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { MatSliderModule } from '@angular/material/slider';
import { COMMON_FORMS_MODULES } from '@shared/common-forms-modules';

@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    COMMON_FORMS_MODULES,
    MatSliderModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
