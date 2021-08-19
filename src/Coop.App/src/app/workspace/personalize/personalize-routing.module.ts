import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalizeComponent } from './personalize.component';

const routes: Routes = [{ path: '', component: PersonalizeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalizeRoutingModule { }
