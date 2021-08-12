import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { accessTokenKey, baseUrl, usernameKey } from './constants';
import { AccessRight, BoardMemberService, ProfileService, User, UserService } from '@api';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    @Inject(baseUrl) private _baseUrl: string,
    private _httpClient: HttpClient,
    private _localStorageService: LocalStorageService,
    private _userService: UserService,
    private _profileService: ProfileService,

  ) {}

  public logout() {
    this._localStorageService.put({ name: accessTokenKey, value: null});
    this._localStorageService.put({ name: usernameKey, value: null });
  }

  public tryToLogin(options: { username: string; password: string }) {
    return this._httpClient.post<any>(`${this._baseUrl}api/user/token`, options)
    .pipe(
      tap(response => {
        this._localStorageService.put({ name: accessTokenKey, value: response.accessToken });
        this._localStorageService.put({ name: usernameKey, value: options.username});
      }),
      switchMap(_ => this._userService.getCurrent()),
      tap(x => this._currentUserSubject.next(x))
    );
  }

  public tryToInitializeCurrentUser(): Observable<User> {
    return combineLatest([this._userService.getCurrent(), this._profileService.getCurrent()])
    .pipe(
      map(([user, profile]) => Object.assign(user, { currentProfile: profile })),
      tap(user => this._currentUserSubject.next(user)),
      catchError(_ => of(null))
    );
  }

  private _currentUserSubject: ReplaySubject<User> = new ReplaySubject(1);

  public currentUser$: Observable<User> = this._currentUserSubject.asObservable();

  public hasReadWritePrivileges$(aggregate:string): Observable<boolean> {
    return this.currentUser$
    .pipe(
      map(user => this._hasPrivilege(user, aggregate, AccessRight.Read) && this._hasPrivilege(user, aggregate, AccessRight.Write))
    )
  }

  _hasPrivilege(user: User, aggregate: string, accessRight: AccessRight):boolean {

    let hasPrivilege = false;

    for(let i = 0; i < user.roles.length; i++) {
      for(let j = 0; j < user.roles[i].privileges.length; j++) {
        let privilege = user.roles[i].privileges[j];
        if(privilege.accessRight == accessRight && privilege.aggregate == aggregate) {
          hasPrivilege = true;
        }
      }
    }

    return hasPrivilege;
  }
}
