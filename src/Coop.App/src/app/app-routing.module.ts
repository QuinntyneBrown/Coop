import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) }, { path: 'workspace', loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
