import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from '@core';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';



@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  public opened = false;

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  public vm$ = of({ });

  constructor(
    private readonly _navigationService: NavigationService,
    private readonly _router: Router,
    private readonly _breakpointObserver: BreakpointObserver

  ) {
    _router.events.pipe(
      filter(a =>a instanceof NavigationEnd),
      takeUntil(this._destroyed$)
    ).subscribe(_ => this.opened = false);
  }

  public handleTitleClick() {
    this._navigationService.redirectToPublicDefault();
  }

  public handleMenuClick() {
    this.opened = !this.opened;
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
