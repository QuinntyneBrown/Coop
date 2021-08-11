import { Component, OnInit } from '@angular/core';
import { User } from '@api';
import { AuthService } from '@core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent {

  constructor(
    private readonly _authService: AuthService
  ) { }

  public currentUser$: Observable<User> = this._authService.currentUser$;

}
