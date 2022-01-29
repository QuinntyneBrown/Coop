import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@api';
import { Aggregate } from '@api/models/aggregate';
import { EventService } from '@api/services/event.service';
import { AuthService, Destroyable, NavigationService } from '@core';
import { merge, Observable } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

const md = "(max-width: 992px)";

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent extends Destroyable implements OnInit {
  
  opened = false;

  readonly Aggregate = Aggregate;

  private readonly _isGreaterThanMedium$ = this._breakpointObserver
  .observe("(min-width: 992px)")
  .pipe(map(breakpointState => breakpointState.matches));

  private readonly _isLessThanMedium$: Observable<boolean> = this._breakpointObserver
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

  readonly mode$ = merge(this._side$, this._over$);

  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer | undefined;

  constructor(
    private readonly _authService: AuthService,
    private readonly _navigationService: NavigationService,
    private readonly _breakpointObserver: BreakpointObserver,
    private readonly _router: Router,
    private readonly _eventService: EventService
  ) { 
    super();
  }

  ngOnInit() {

    this._eventService.events$.subscribe();
    
    this._router.events
      .pipe(
        takeUntil(this._destroyed$),
        tap(x => {
          if (x instanceof NavigationEnd && this.drawer?.mode == "over") {
            this.drawer?.close();
          }
        })
      )
      .subscribe();
  }

  readonly currentUser$: Observable<User> = this._authService.currentUser$;

  logout() {
    this._authService.logout();
    this.redirectToPublicDefault();
  }

  hasReadWritePrivileges$(aggregate:string) {
    return this._authService.hasReadWritePrivileges$(aggregate);
  }

  redirectToPublicDefault() {
    this._navigationService.redirectToPublicDefault();
  }
}
