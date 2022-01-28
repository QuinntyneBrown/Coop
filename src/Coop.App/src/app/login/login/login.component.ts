import { Component, OnInit } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { NavigationService } from '@core/navigation.service';
import { Destroyable, LocalStorageService, loginCredentialsKey } from '@core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Destroyable implements OnInit {

  username: string = null;

  password: string = null;

  rememberMe: boolean = null;

  constructor(
    private readonly _authService: AuthService,
    private readonly _navigationService: NavigationService,
    private readonly _localStorageService: LocalStorageService
  ) {
    super();
   }

  ngOnInit() {
    this._authService.logout();

    const loginCredentials = this._localStorageService.get({ name: loginCredentialsKey });

    if (loginCredentials && loginCredentials.rememberMe) {
      this.username = loginCredentials.username;
      this.password = loginCredentials.password;
      this.rememberMe = loginCredentials.rememberMe;
    }
  }

  handleTryToLogin($event: { username: string, password: string, rememberMe: boolean }) {

    this._localStorageService.put({ name: loginCredentialsKey, value: $event.rememberMe ? $event : null });

    this._authService
    .tryToLogin({
      username: $event.username,
      password: $event.password
    })
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._navigationService.redirectPreLogin())
    )
    .subscribe();
  }
}
