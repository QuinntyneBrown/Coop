import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnCallComponent } from './on-call.component';

const routes: Routes = [{ path: '', component: OnCallComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnCallRoutingModule { }
