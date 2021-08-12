import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRequestsRoutingModule } from './maintenance-requests-routing.module';
import { MaintenanceRequestsComponent } from './maintenance-requests.component';


@NgModule({
  declarations: [
    MaintenanceRequestsComponent
  ],
  imports: [
    CommonModule,
    MaintenanceRequestsRoutingModule
  ]
})
export class MaintenanceRequestsModule { }
