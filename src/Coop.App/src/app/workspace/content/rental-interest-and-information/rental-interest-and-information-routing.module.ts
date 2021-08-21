import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalInterestAndInformationComponent } from './rental-interest-and-information.component';

const routes: Routes = [{ path: '', component: RentalInterestAndInformationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentalInterestAndInformationRoutingModule { }
