import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateProfileRequest, ProfileService } from '@api';
import { NavigationService } from '@core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnDestroy {

  private readonly _destroyed$ = new Subject();

  constructor(
    private readonly _profileService: ProfileService,
    private readonly _navigationService: NavigationService
  ) { }

  public create(createProfileRequest: CreateProfileRequest) {
    this._profileService.create(createProfileRequest)
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._navigationService.redirectToLogin())
    )
    .subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }
}
