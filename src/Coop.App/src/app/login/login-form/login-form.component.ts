// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Output, EventEmitter, Renderer2, AfterContentInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements AfterContentInit {
  @Input()
  username: string = null;

  @Input()
  password: string = null;

  @Input()
  rememberMe: boolean = null;

  readonly form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required]),
    rememberMe: new FormControl(this.rememberMe,[])
  });

  @Output() readonly tryToLogin: EventEmitter<{ username: string, password: string }> = new EventEmitter();

  ngAfterContentInit(): void {
    this.form.patchValue({
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }
}

