import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class HeaderModule { }
