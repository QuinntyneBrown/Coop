import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestComponent } from './maintenance-request.component';



@NgModule({
  declarations: [
    MaintenanceRequestComponent
  ],
  exports: [
    MaintenanceRequestComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MaintenanceRequestModule { }
