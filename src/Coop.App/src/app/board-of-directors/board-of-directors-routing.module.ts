import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardOfDirectorsComponent } from './board-of-directors.component';

const routes: Routes = [{ path: '', component: BoardOfDirectorsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardOfDirectorsRoutingModule { }
