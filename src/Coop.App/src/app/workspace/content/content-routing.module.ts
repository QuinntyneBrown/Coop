import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content.component';

const routes: Routes = [
  {
    path: '',
    component: ContentComponent,
    children: [
      { path: '', redirectTo: 'hero', pathMatch: 'full' },
      { path: 'hero', loadChildren: () => import('./hero/hero.module').then(m => m.HeroModule) },
      { path: 'splash', loadChildren: () => import('./splash/splash.module').then(m => m.SplashModule) },
      { path: 'contact-us', loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule) },
      { path: 'board', loadChildren: () => import('./board/board.module').then(m => m.BoardModule) },
      { path: 'management', loadChildren: () => import('./management/management.module').then(m => m.ManagementModule) },
      { path: 'on-call', loadChildren: () => import('./on-call/on-call.module').then(m => m.OnCallModule) },
      { path: 'rental-interest-and-information', loadChildren: () => import('./rental-interest-and-information/rental-interest-and-information.module').then(m => m.RentalInterestAndInformationModule) }
    ]
   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
