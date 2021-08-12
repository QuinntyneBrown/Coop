import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ByLawsComponent } from './by-laws.component';

const routes: Routes = [{ path: '', component: ByLawsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ByLawsRoutingModule { }
