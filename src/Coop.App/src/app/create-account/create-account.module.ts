import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountRoutingModule } from './create-account-routing.module';
import { CreateAccountComponent } from './create-account.component';
import { CreateAccountFormComponent } from './create-account-form/create-account-form.component';
import { MatCardModule } from '@angular/material/card';
import { COMMON_FORMS_MODULES } from '@shared';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    CreateAccountComponent,
    CreateAccountFormComponent
  ],
  imports: [
    CommonModule,
    CreateAccountRoutingModule,
    MatCardModule,
    COMMON_FORMS_MODULES,
    RouterModule,
    MatSnackBarModule
  ]
})
export class CreateAccountModule { }
