import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { NavigationService } from '@core/navigation.service';
import { LocalStorageService, loginCredentialsKey } from '@core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy, OnInit {

  private readonly _destroyed: Subject<void> = new Subject();

  public username: string = null;

  public password: string = null;

  public rememberMe: boolean = null;

  constructor(
    private readonly _authService: AuthService,
    private readonly _navigationService: NavigationService,
    private readonly _localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this._authService.logout();

    const loginCredentials = this._localStorageService.get({ name: loginCredentialsKey });

    if (loginCredentials && loginCredentials.rememberMe) {
      this.username = loginCredentials.username;
      this.password = loginCredentials.password;
      this.rememberMe = loginCredentials.rememberMe;
    }
  }

  public handleTryToLogin($event: { username: string, password: string, rememberMe: boolean }) {

    this._localStorageService.put({ name: loginCredentialsKey, value: $event.rememberMe ? $event : null });

    this._authService
    .tryToLogin({
      username: $event.username,
      password: $event.password
    })
    .pipe(
      takeUntil(this._destroyed),
    )
    .subscribe(
      () => {
        this._navigationService.redirectPreLogin();
      },
      errorResponse => {
        // handle error response
      }
    );
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
