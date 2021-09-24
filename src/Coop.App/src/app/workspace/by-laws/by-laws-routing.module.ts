import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ByLawListComponent } from './by-law-list/by-law-list.component';


const routes: Routes = [{ path: '', component: ByLawListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ByLawsRoutingModule { }
