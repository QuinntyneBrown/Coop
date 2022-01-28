import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { Destroyable, NavigationService } from '@core';
import { Observable, of, Subject } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';



@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends Destroyable {

  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  opened = false;

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );


  vm$ = of({ });

  constructor(
    private readonly _navigationService: NavigationService,
    private readonly _router: Router,
    private readonly _breakpointObserver: BreakpointObserver

  ) {
    super();
    
    _router.events.pipe(
      filter(a =>a instanceof NavigationEnd),
      takeUntil(this._destroyed$)
    ).subscribe(_ => this.opened = false);
  }

  handleTitleClick() {
    this._navigationService.redirectToPublicDefault();
  }

  handleMenuClick() {
    this.opened = !this.opened;
  }
}
