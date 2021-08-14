import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceRequestListComponent } from './maintenance-request-list/maintenance-request-list.component';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';


const routes: Routes = [
  { path: '', component: MaintenanceRequestListComponent },
  { path: 'create', component: MaintenanceRequestComponent },
  { path: 'edit/:maintenanceRequestId', component: MaintenanceRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRequestsRoutingModule { }
