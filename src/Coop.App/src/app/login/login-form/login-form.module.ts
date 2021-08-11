import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form.component';
import { COMMON_FORMS_MODULES } from '@shared';
import { MatCardModule } from '@angular/material/card';


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
    COMMON_FORMS_MODULES
  ]
})
export class LoginFormModule { }
