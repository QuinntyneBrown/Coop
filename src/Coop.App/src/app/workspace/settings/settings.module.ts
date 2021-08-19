import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { MatSliderModule } from '@angular/material/slider';

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
