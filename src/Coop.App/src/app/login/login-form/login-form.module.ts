import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    LoginFormComponent
  ],
  exports: [
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    COMMON_FORMS_MODULES,
    RouterModule
  ]
})
export class LoginFormModule { }
