import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateMaintenanceRequestComponent } from './create-maintenance-request/create-maintenance-request.component';
import { MaintenanceRequestListComponent } from './maintenance-request-list/maintenance-request-list.component';
import { MaintenanceRequestComponent } from './maintenance-request/maintenance-request.component';
import { UpdateMaintenanceRequestDescriptionComponent } from './update-maintenance-request-description/update-maintenance-request-description.component';


const routes: Routes = [
  { path: '', component: MaintenanceRequestListComponent },
  { path: 'create', component: CreateMaintenanceRequestComponent },
  { path: 'edit/:maintenanceRequestId', component: UpdateMaintenanceRequestDescriptionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRequestsRoutingModule { }
