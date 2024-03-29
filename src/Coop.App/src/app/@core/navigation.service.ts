// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  loginUrl = '/login';

  lastPath: string = '';

  defaultPath = '/workspace';

  setLoginUrl(value: string): void {
    this.loginUrl = value;
  }

  setDefaultUrl(value: string): void {
    this.defaultPath = value;
  }

  public redirectToLogin(): void {
    this.router.navigate([this.loginUrl]);
  }

  public redirectToPublicDefault(): void {
    window.location.href = '';
    //this.router.navigate(['']);
  }

  public redirectPreLogin(): void {
    if (this.lastPath && this.lastPath !== this.loginUrl) {
      window.location.href = this.lastPath;
      this.lastPath = '';
    } else {
      this.router.navigate([this.defaultPath]);
      window.location.href = this.defaultPath;
    }
  }
}

