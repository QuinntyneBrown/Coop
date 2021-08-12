import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceRequestsComponent } from './maintenance-requests.component';

const routes: Routes = [{ path: '', component: MaintenanceRequestsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceRequestsRoutingModule { }
