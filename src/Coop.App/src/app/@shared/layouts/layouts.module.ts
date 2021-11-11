import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '@shared/header/header.module';
import { FooterModule } from '@shared/footer';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeroModule } from '@shared/hero/hero.module';



@NgModule({
  declarations: [
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderModule,
    FooterModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    HeroModule
  ]
})
export class LayoutModule { }
