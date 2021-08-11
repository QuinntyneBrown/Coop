import { Component } from '@angular/core';
import { User } from '@api';
import { AuthService } from '@core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppContextService } from './app-context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AppContextService
  ]
})
export class AppComponent {
  public vm$ = this._authService.tryToInitializeCurrentUser()
  .pipe(
    map(user => ({ user }))
  );

  public currentUser$: Observable<User> = this._authService.currentUser$;

  constructor(
    private readonly _authService: AuthService
    ) { }
}
