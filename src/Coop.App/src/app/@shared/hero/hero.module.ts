import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './hero.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeroComponent
  ],
  exports: [
    HeroComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HeroModule { }
