import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@api';
import { Aggregate } from '@api/models/aggregate';
import { AuthService, NavigationService } from '@core';
import { merge, Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

const md = "(max-width: 992px)";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, OnDestroy {

  private readonly _destroyed$ = new Subject();

  public opened = false;

  public Aggregate = Aggregate;

  private _isGreaterThanMedium$ = this._breakpointObserver
  .observe("(min-width: 992px)")
  .pipe(map(breakpointState => breakpointState.matches));

  private _isLessThanMedium$: Observable<boolean> = this._breakpointObserver
    .observe("(max-width: 992px)")
    .pipe(map(breakpointState => breakpointState.matches));

  private readonly _side$ = this._isGreaterThanMedium$.pipe(
    filter(matches => matches),
    tap(_ => this.drawer?.open()),
    map(_ => "side")
  );

  private readonly _over$ = this._isLessThanMedium$.pipe(
    filter(matches => matches),
    tap(_ => this.drawer?.close()),
    map(_ => "over")
  );

  public mode$ = merge(this._side$, this._over$);

  @ViewChild(MatDrawer, { static: true }) public drawer: MatDrawer | undefined;

  constructor(
    private readonly _authService: AuthService,
    private readonly _navigationService: NavigationService,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _router: Router
  ) { }

  public ngOnInit() {
    this._router.events
      .pipe(
        takeUntil(this._destroyed$),
        tap(x => {
          if (x instanceof NavigationEnd && this.drawer?.mode == "over") {
            this.drawer?.close();
          }
          //this._matDrawerContentElement.scrollTop = 0;
        })
      )
      .subscribe();
  }

  public currentUser$: Observable<User> = this._authService.currentUser$;

  public logout() {
    this._authService.logout();
    this.redirectToPublicDefault();
  }

  public hasReadWritePrivileges$(aggregate:string) {
    return this._authService.hasReadWritePrivileges$(aggregate);
  }

  public redirectToPublicDefault() {
    this._navigationService.redirectToPublicDefault();
  }

  ngOnDestroy() {
    this._destroyed$.complete();
    this._destroyed$.next();
  }
}
