import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalizeRoutingModule } from './personalize-routing.module';
import { PersonalizeComponent } from './personalize.component';


@NgModule({
  declarations: [
    PersonalizeComponent
  ],
  imports: [
    CommonModule,
    PersonalizeRoutingModule
  ]
})
export class PersonalizeModule { }
