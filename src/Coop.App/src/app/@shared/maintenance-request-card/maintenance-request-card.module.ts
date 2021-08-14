import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceRequestCardComponent } from './maintenance-request-card.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MaintenanceRequestCardComponent
  ],
  exports: [
    MaintenanceRequestCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MaintenanceRequestCardModule { }
