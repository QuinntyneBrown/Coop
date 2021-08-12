import { Component, OnInit } from '@angular/core';
import { User } from '@api';
import { Aggregate } from '@api/models/aggregate';
import { AuthService, NavigationService } from '@core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {


  public Aggregate = Aggregate;

  constructor(
    private readonly _authService: AuthService,
    private readonly _navigationService: NavigationService
  ) { }

  public currentUser$: Observable<User> = this._authService.currentUser$;

  public logout() {
    this._authService.logout();
    this._navigationService.redirectToPublicDefault();
  }

  public hasReadWritePrivileges$(aggregate:string) {
    return this._authService.hasReadWritePrivileges$(aggregate);
  }

}
