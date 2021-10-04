import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core';
import { Route } from '@shared';

const routes: Routes = [
  Route.withShell([
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
    { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
    { path: 'rental-interest-and-information', loadChildren: () => import('./rental-interest-and-information/rental-interest-and-information.module').then(m => m.RentalInterestAndInformationModule) },
    { path: 'on-call-staff', loadChildren: () => import('./on-call-staff/on-call-staff.module').then(m => m.OnCallStaffModule) },
    { path: 'office-staff', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
    { path: 'board-of-directors', loadChildren: () => import('./board-of-directors/board-of-directors.module').then(m => m.BoardOfDirectorsModule) }
  ]),
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'workspace', loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule), canActivate: [AuthGuard] },
  { path: 'create-account', loadChildren: () => import('./create-account/create-account.module').then(m => m.CreateAccountModule) },
];

@NgModule({
  imports: [RouterModule.forRoot( routes, {
    scrollPositionRestoration: "top"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
