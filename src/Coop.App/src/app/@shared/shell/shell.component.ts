import { Component} from '@angular/core';
import { NavigationService } from '@core';
import { Observable, of } from 'rxjs';



@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  public vm$ = of({ });

  constructor(
    private readonly _navigationService: NavigationService
  ) {

  }

  public handleTitleClick() {
    this._navigationService.redirectToPublicDefault();
  }
}
