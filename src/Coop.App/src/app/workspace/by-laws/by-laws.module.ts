import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ByLawsRoutingModule } from './by-laws-routing.module';
import { ByLawsComponent } from './by-laws.component';


@NgModule({
  declarations: [
    ByLawsComponent
  ],
  imports: [
    CommonModule,
    ByLawsRoutingModule
  ]
})
export class ByLawsModule { }
