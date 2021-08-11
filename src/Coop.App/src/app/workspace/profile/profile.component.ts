import { Component } from '@angular/core';
import { ProfileService, User, UserService } from '@api';
import { AuthService } from '@core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  {

  public currentUser$: Observable<User> = this._authService.currentUser$;

  public vm$ = this._profileService.getCurrent()
  .pipe(
    map(profile => ({ profile }))
  );

  constructor(
    private readonly _authService: AuthService,
    private readonly _profileService: ProfileService,
  ) {

  }
}
