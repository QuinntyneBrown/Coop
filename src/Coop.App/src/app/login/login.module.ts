import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { LoginFormModule } from './login-form/login-form.module';
import { CreateAccountComponent } from './create-account/create-account.component';


@NgModule({
  declarations: [
    LoginComponent,
    CreateAccountComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    LoginFormModule
  ]
})
export class LoginModule { }
